const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, CustomAPIError } = require('../errors');
const Chat = require('../models/topic/chat'); // Import the Chat model
const topicModels = require('../models/topic/topicIndex');

const dummyChat=async(req,res)=>{
    const { query,topicId, resourceId} = req.body;
    return res.status(StatusCodes.OK).json({
        message: 'Query processed successfully',
        chat: {
            topicId: topicId,
            resourceId: resourceId,
            messages: [
                { role: 'user', content: query },
                { role: 'assistant', content: 'This is a dummy response.' }
            ]
        }
    });
}

const chat = async (req, res) => {
    try {
        const { query, topicId, resourceId } = req.body;

        if (!query || !topicId || !resourceId) {
            throw new BadRequestError('Please provide a query, topicId, and resourceId');
        }

        const userId = req.user.userId;

        // 1. Get existing chat history
        const existingChat = await Chat.findOne({ resourceId }).sort({ createdAt: -1 });

        let chatHistory = [];
        let parentChatId = null;

        if (existingChat) {
            chatHistory = existingChat.messages;
            parentChatId = existingChat._id;
        }

        // 2. Call Python API
        const apiResponse = await axios.post('http://127.0.0.1:8000/respond/', {
            user_query: query,
            messages: chatHistory,
            topicId,
            summary: existingChat?.summary || [],
            resourceId,
            userId:userId
        }, { timeout: 60000 });

        console.log('Python API Response:', apiResponse.data);

        const assistantResponse = apiResponse.data?.message;
        if (!assistantResponse?.trim()) {
            throw new Error('Invalid response format from Python API');
        }

        // 3. Create message objects
        const messages = [
            {
                role: 'user',
                content: query.trim()
            },
            {
                role: 'assistant',
                content: assistantResponse.trim()
            }
        ];

        // 4. Create new chat document
        const newChat = await Chat.create({
            topicId,
            resourceId,
            parentChatId,
            userId,
            messages,
            summary: apiResponse.data.summary || []
        });

        return res.status(StatusCodes.OK).json({
            message: 'Chat processed successfully',
            chat: newChat
        });

    } catch (error) {
        console.error('Chat Error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Chat processing failed',
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
};
const getChatById=async(req,res)=>{
    const resourceId=req.params.resourceId;

    try {
        const chat=await topicModels.Chat.findById(resourceId);
        if(!chat){
            throw new NotFoundError('Chat not found');
        }
        return res.status(StatusCodes.OK).json({
            msg:'Chat fetched successfully',
            chat
        });

    } catch (error) {
        if(error instanceof NotFoundError){
            return res.status(StatusCodes.NOT_FOUND).json({
                msg:error.message
            });
        }else{
            console.error('Error in getChatById function:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                msg: 'Internal server error',
                error: error.message
            });
        }   
    }
}
module.exports = {
    chat,
    dummyChat,
    getChatById
};