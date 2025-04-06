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
        // const { query, topicId, resourceId, tempt } = req.body;
        const { query,topicId, resourceId} = req.body;

        if (!query || !topicId || !resourceId) {
            throw new BadRequestError('Please provide a query, topicId, and resourceId');
        }

        const userId = req.user.userId;
        //remove
        // return res.status(StatusCodes.OK).json({
        //     message: 'Query processed successfully',
        //     chat: newChat // Include the new chat document in the response
        // });

        // 1. Get the chat history by resourceId
        const existingChat = await Chat.findOne({ resourceId: resourceId }).sort({ createdAt: -1 });
        let chatHistory = [];
        let parentChatId = null;

        if (existingChat) {
            chatHistory = existingChat.messages;
            parentChatId = existingChat._id;
        }

        const apiEndpoint = 'http://127.0.0.1:8000/respond/'; // Replace with your Python API endpoint

        // 2. Send the query and chat history to the API
        const apiResponse = await axios.post(apiEndpoint, {
            user_query: query,
            messages: chatHistory,
            topicId: topicId,
            summary: existingChat ? existingChat.summary : [],
            resourceId: resourceId,
            // tempt
        }, {
            timeout: 60000 // Timeout in milliseconds (60 seconds)
        });

        // 3. Extract the assistant's response from the API response
        const assistantResponse = apiResponse.data.response;

        // 4. Create new messages for user and assistant
        const userMessage = { role: 'user', content: query };
        const assistantMessage = { role: 'assistant', content: assistantResponse };

        // 5. Create a new chat document
        const newChat = await Chat.create({
            topicId: topicId,
            resourceId: resourceId,
            parentChatId: parentChatId || null,
            userId: userId,
            tempt: tempt,
            messages: [userMessage, assistantMessage]
        });

        return res.status(StatusCodes.OK).json({
            message: 'Query processed successfully',
            chat: newChat // Include the new chat document in the response
        });

    } catch (error) {
        console.error('Error in chat function:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    chat,
    dummyChat
};