const scrapeTranscript = require('../services/scrapeTranscript');
const pdfParser = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const openai = require('../config/openAiClient');
const Resource = require('../models/topic/resources');  
const Chat = require('../models/topic/chat');


const uploadURL = async (req, res) => {
    const url = String(req.body.url);
    const topicId = req.body.topic;
    const userId = req.user.userId;  
    const video_id = new URL(url).searchParams.get('v');
    
    if (!video_id) {
        return res.status(400).send('Invalid URL: Video ID not found.');
    }

    try {
        const existingResource = await Resource.findOne({ source: url, userId });
        
        if (existingResource) {
            return res.status(200).json({ message: 'Resource already exists', data: existingResource });
        }

        console.log('Scraping the transcript...');
        const transcript = await scrapeTranscript(url);
        if (!transcript) {
            return res.status(404).send('Transcript not available for this video');
        }
        console.log('Transcript found');

        const newResource = new Resource({
            title: `Video Transcript for ${video_id}`,
            type: 'youtube',
            source: url,
            content: transcript,
            topicId,
            userId,
            metadata: {}
        });
        await newResource.save();
        console.log('Resource saved successfully');

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { 
                    role: "system", 
                    content: `This is the transcript context: ${transcript}. Give me a summary of the content in the transcript.` 
                },
            ],
        });
        console.log(aiResponse.choices[0].message);

        const newChat = new Chat({
            topicId,
            userId,
            messages: [
                {
                    role: 'system',
                    content: `This is the transcript context:\n\n${transcript}`
                },
                {
                    role: 'assistant',
                    content: aiResponse.choices[0].message.content
                }
            ],
            summary: []
        });
        await newChat.save();

        res.status(201).json({ 
            message: 'Resource and initial chat context saved successfully', 
            data: newChat 
        });
    } catch (error) {
        if (error.code === 11000) {  
            return res.status(409).json({ message: 'Resource already exists for this user and video' });
        }
        console.error('Error: ', error.message);
        res.status(400).send('Invalid URL provided.');
    }
};

const uploadPDF = async (req, res) => {
    if (!req.file) {
        return res.status(500).json({ message: "File not uploaded" });
    }
    const userId = req.user.userId;
    const topicId = req.body.topic;
    const pdfBuffer = req.file.buffer;

    try {
        const data = await pdfParser(pdfBuffer);
        const transcript = data.text;

        const pdfPath = path.join(__dirname, '..', 'uploads', `${req.file.originalname}_${Date.now()}`);
        fs.writeFileSync(pdfPath, pdfBuffer);

        const newResource = new Resource({
            title: `PDF Transcript for ${req.file.originalname}`,
            type: 'pdf',
            source: pdfPath,
            content: transcript,
            topicId,
            userId,
            metadata: {
                fileSize: req.file.size
            }
        });
        await newResource.save();
        console.log("Resource saved successfully");

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `This is the transcript context: ${transcript}. Give me a summary of the content in the transcript.`
                },
            ],
        });
        console.log(aiResponse.choices[0].message);

        const newChat = new Chat({
            topicId,
            userId,
            messages: [
                {
                    role: 'system',
                    content: `This is the transcript context:\n\n${transcript}`
                },
                {
                    role: 'assistant',
                    content: aiResponse.choices[0].message.content
                }
            ],
            summary: [] 
        });
        await newChat.save();

        res.status(201).json({ message: "Resource and initial chat context saved successfully", data: newChat });
    } catch (error) {
        console.error('Error :', error.message);
        res.status(400).json({ message: "An error occurred while processing the PDF" });
    }
};

module.exports = { home, uploadURL, uploadPDF };