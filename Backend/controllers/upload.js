const scrapeTranscript = require('./scrapeTranscript');
const pdfParser=require('pdf-parse')
const fs=require('fs')
const path=require('path')

const openai = require('./openAiClient');
const Transcript=require('../models/transcript')
const ChatSession=require('../models/ChatSession')


const home=(req,res)=>{
    res.send('home route')
}
const uploadURL = async (req, res) => {
    const url = String(req.body.url);
    const topic = req.body.topic;
    const userId = req.user.userId;  
    const video_id = new URL(url).searchParams.get('v');
    
    if (!video_id) {
        return res.status(400).send('Invalid URL: Video ID not found.');
    }

    try {
        // Check for existing transcript for the specific video and user
        const existingTranscript = await Transcript.findOne({ videoID: video_id, user: userId });
        
        if (existingTranscript) {
            // If the transcript exists, return it without scraping again
            return res.status(200).json({ message: 'Transcript already exists', data: existingTranscript });
        }

        //scraping
        console.log('Scraping the transcript...');
        const transcript = await scrapeTranscript(url);
        
        if (!transcript) {
            return res.status(404).send('Transcript not available for this video');
        } 
        console.log('Transcript found');

        // Save the transcript with a unique combination of videoID and user
        const newTranscript = new Transcript({
            videoID: video_id,
            transcript,
            topic,
            user: userId
        });

        try {
            await newTranscript.save(); 
            console.log('Transcript saved successfully');
        } catch (error) {
            console.error('Error saving transcript:', error); 
            // res.status(500).send('Error saving transcript.');
        }
        // console.log('fd')

        // Create an initial chat context for the transcript
        const initialChat = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                
                { 
                    role: "system", 
                    content: `This is the transcript context: ${transcript}. give me a summary of the content in transcript.` },
            ],
        });
        console.log(initialChat.choices[0].message);
        
        // Save the initial chat session
        const newSession = new ChatSession({
            user: userId,
            transcriptID: newTranscript._id,
            messages: [
                {
                    role: 'system',
                    content: `This is the transcript context:\n\n${transcript}`
                },
                {
                role: 'assistant',
                content: initialChat.choices[0].message.content
                }
            ]
        });
        
        await newSession.save();
        
        res.status(201).json({ message: 'Transcript and initial chat context saved successfully', data: newSession });
        
    } catch (error) {
        // 11000 - this is duplicate key error code in mongodb
        if (error.code === 11000) {  
            return res.status(409).json({ message: 'Transcript already exists for this user and video' });
        }
        
        console.error('Error: ', error.message);
        res.status(400).send('Invalid URL provided.');
    }
};
const uploadPDF=async(req,res)=>{
    if(!req.file){
        return res.status(500).json({message:"file not uploaded"})
    }
    const userId=req.user.userId;
    const topic=req.body.topic;
    const pdfBuffer=req.file.buffer;

    // const transcript=await pdfParser(req.file.buffer)
    try {
        //parsing the pdf
        const data=await pdfParser(pdfBuffer);
        const transcript=data.text;

        //save pdf locally 
        const pdfPath=path.join(__dirname,'..','uploads',`${req.file.originalname}_${Date.now()}`);
        fs.writeFileSync(pdfPath,pdfBuffer);

        const newTranscript=new Transcript({
            videoID:pdfPath,
            transcript,
            topic,
            user:userId
        });
        await newTranscript.save();
        console.log("Transcript saved successfully");
        
        const initialChat=await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[
                {
                    role:"system",
                    content:`this is the trancsript context : ${transcript}. give me a summary of the content in the transcript . `
                },
            ],
        });
        console.log(initialChat.choices[0].message);

        const newSession=new ChatSession({
            user:userId,
            transcriptID:newTranscript._id,
            messages:[
                {role:'system',
                    content:`this is the transcript context :\n\n${transcript}`
                },
                {
                    role:'assistant',
                    content:initialChat.choices[0].message.content
                }
            ]
        })

        await newSession.save();

        res.status(201).json({message:"transcript and intital chat context savedd successfully",data:newSession})
        // res.send('he;llooo')
    } catch (error) {
        console.log('Error :',error.message);
        res.status(400).json({message:"an error occures while processing the pdf"})}
}


module.exports={home,uploadURL,uploadPDF}