const scraper = require('../../services/scrapeTranscript');
// const pdfParser= require('pdf-parse');
// const fs = require('fs');
// const path = require('path');
const {StatusCodes}=require('http-status-codes');
const errorsController=require('../../errors/index')
const topicModels=require('../../models/topic/topicIndex')

const uploadUrl=async(req,res)=>{
    const url=String(req.body.url);
    const topicId=req.body.topicId;
    const userId=req.user.userId;

    const videoId=new URL(url).searchParams.get('v');
    if(!videoId){
        return res.status(StatusCodes.BAD_REQUEST).send('Invalid URL: Video ID not found.');
    }
    try {
        const existingVideo=await topicModels.Resource.findOne({source:url,userId,topicId});
        if(existingVideo)
            throw new errorsController.BadRequestError('Resource already exists',existingVideo);
        
        // console.log('scraping transcript...')
        const transcript=await scraper(url);
        if(!transcript)
            throw new errorsController.NotFoundError('Transcript not available for this video');    
        // console.log(transcript)
        
        const newResource=new topicModels.Resource({
            type:'video',
            source:url,
            content:transcript,
            topicId:topicId,
            userId:userId
        })
        await newResource.save();
        //call openai api to start chat 
        return res.status(StatusCodes.CREATED).json({message:'Resource created successfully',data:newResource});        
    } catch (error) {
        if(error instanceof errorsController.BadRequestError || error instanceof errorsController.NotFoundError) {
            return res.status(error.statusCode).json({message:error.message,data:error.data});
        }else{
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error',error:error.message});
        }
    }
}

module.exports={
    uploadUrl
}