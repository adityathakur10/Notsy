import axios from '../utils/axios';

export const sendChatMessage = async (chatData) => {
  try {
    // Remove extra /notsy from the URL since it's already in the base URL
    const response = await axios.post('/chat', chatData);
    return response.data;
  } catch (error) {
    console.error('Chat service error:', {
      status: error.response?.status,
      message: error.response?.data?.msg || error.message,
      endpoint: '/chat'
    });
    throw error;
  }
};