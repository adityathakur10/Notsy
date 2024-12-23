const scrapeTranscript = require('./scrapeTranscript');
const openai = require('./openAiClient');

const Transcript=require('../models/transcript')
const ChatSession=require('../models/ChatSession')


const home=(req,res)=>{
    res.send('home route')
}

// const uploadURL = async (req, res) => {
//     const url = String(req.body.url);
//     const topic = req.body.topic;
//     const userId=req.user.userId
//     const video_id = new URL(url).searchParams.get('v');
//     if (!video_id) {return res.status(400).send('Invalid URL: Video ID not found.');}

//     try {
//             //check for existing transcript
//             const existingTranscript = await Transcript.findOne({ videoID:video_id, user: userId });
//             if (existingTranscript) {
//                 // console.log('already exists')
//                 return res.status(200).json({ message: 'Transcript already exists', data: existingTranscript });
//             }

//             // Scrape the transcript using Puppeteer
//             console.log('hwloooo')
//             const transcript = await scrapeTranscript(url);
//             if (!transcript) {
//                 return res.status(404).send('Transcript not available for this video');
//             }else{
//                 // res.send(transcript)
//                 console.log('transcript found')
//             }

//             // Save the transcript 
//             const newTranscript = new Transcript({
//                 videoID:video_id,
//                 transcript,
//                 topic,
//                 user: userId
//             });
//             await newTranscript.save();
//             // console.log('vbnm')

//             const initialChat = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo", 
//                 messages: [
//                     { role: "system", content: `This is the transcript context: ${transcript}. Use this information for future queries.` },
//                 ],
//             });
//             console.log(initialChat.choices[0].message)
//             const newSession=new ChatSession({
//                 user:userId,
//                 transcriptID:newTranscript._id,
//                 messages:[{
//                     role:'assistant',
//                     content: initialChat.choices[0].message.content
//                 }]
//             })
//             await newSession.save();
            
//             res.status(201).json({ message: 'Transcript and initial chat context saved successfully', data: newSession });
        
//     } catch (error) {
//         console.error('Error: ', error.message);
//         res.status(400).send('Invalid URL provided.');
//     }
// };
const uploadURL = async (req, res) => {
    const url = String(req.body.url);
    const topic = req.body.topic;
    const userId = req.user.userId;  // Assuming userId is fetched from JWT token
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

        // Scrape the transcript using Puppeteer
        console.log('Scraping the transcript...');
        const transcript = await scrapeTranscript(url);
        
        if (!transcript) {
            return res.status(404).send('Transcript not available for this video');
        } else {
            console.log('Transcript found');
        }

        // Save the transcript with a unique combination of videoID and user
        const newTranscript = new Transcript({
            videoID: video_id,
            transcript,
            topic,
            user: userId
        });

        try {
            await newTranscript.save(); // Ensure this doesn't throw any error
            console.log('Transcript saved successfully');
        } catch (error) {
            console.error('Error saving transcript:', error); // Log any error
            // res.status(500).send('Error saving transcript.');
        }
        // console.log('fd')
        // await newTranscript.save(); // This will be allowed due to the compound unique index
        // Create an initial chat context for the transcript
        const initialChat = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: `This is the transcript context: ${transcript}. Use this information for future queries.` },
            ],
        });

        console.log(initialChat.choices[0].message);
        
        // Save the initial chat session
        const newSession = new ChatSession({
            user: userId,
            transcriptID: newTranscript._id,
            messages: [{
                role: 'assistant',
                content: initialChat.choices[0].message.content
            }]
        });
        
        await newSession.save();
        
        res.status(201).json({ message: 'Transcript and initial chat context saved successfully', data: newSession });
        
    } catch (error) {
        // Handle duplicate key error gracefully
        if (error.code === 11000) {  // This is the duplicate key error code in MongoDB
            return res.status(409).json({ message: 'Transcript already exists for this user and video' });
        }
        
        console.error('Error: ', error.message);
        res.status(400).send('Invalid URL provided.');
    }
};


module.exports={home,uploadURL}