const ChatSession = require('../models/ChatSession');
const openai = require('./openAiClient');

const chat = async (req, res) => {
    const { chatSessionId, message } = req.body;
    const userId = req.user.userId;

    try {
        const chatSession = await ChatSession.findOne({ _id: chatSessionId, user: userId });
        if (!chatSession) {
            return res.status(404).json({ message: "Chat session does not exist" });
        }

        chatSession.messages.push({ role: "user", content: message });

        // Get response from OpenAI
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatSession.messages // Full message history is sent for context
        });
        const aiMessage = aiResponse.choices[0].message.content;

        // Save response
        chatSession.messages.push({ role: "assistant", content: aiMessage });
        await chatSession.save();

        res.status(200).json({ message: aiMessage });
    } catch (error) {
        console.error("Error during chat:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

module.exports = chat;