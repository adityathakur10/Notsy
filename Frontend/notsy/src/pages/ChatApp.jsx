import React, { useState } from 'react';
import ChatHistory from '../components/ChatHistory';
import Cookies from 'js-cookie';

const ChatApp = () => {
  // Sample chat history data
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Getting started with Notsy', timestamp: '2 hours ago' },
    { id: 2, title: 'How to organize notes', timestamp: 'Yesterday' },
    { id: 3, title: 'Task management tips', timestamp: '3 days ago' },
  ]);
  
  const [activeConversation, setActiveConversation] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleConversationSelect = (id) => {
    setActiveConversation(id);
  };
  
  const handleNewChat = () => {
    const newId = Math.max(0, ...conversations.map(conv => conv.id)) + 1;
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      timestamp: 'Just now'
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newId);
  };
  
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* Sidebar - adjusted width for desktop */}
      <div className={`${
        isSidebarOpen ? 'w-50 md:w-66' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <ChatHistory 
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleConversationSelect}
          onNewChat={handleNewChat}
        />
      </div>
      
      {/* Main Content - with proper overflow handling */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm flex-shrink-0">
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-80">Notsy AI Assistant</h1>
        </header>
        
        {/* Main content area with proper overflow */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 inline-flex mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Ask me anything about notes, tasks, or information management. I'm here to assist you.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                <button className="bg-white p-4 border border-gray-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  <h3 className="font-medium text-gray-80 mb-1">Create a new note</h3>
                  <p className="text-sm text-gray-500">Start writing a note with formatting options</p>
                </button>
                <button className="bg-white p-4 border border-gray-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  <h3 className="font-medium text-gray-80 mb-1">Organize your notes</h3>
                  <p className="text-sm text-gray-500">Learn how to structure your information</p>
                </button>
                <button className="bg-white p-4 border border-gray-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  <h3 className="font-medium text-gray-80 mb-1">Set up reminders</h3>
                  <p className="text-sm text-gray-500">Never miss important deadlines</p>
                </button>
                <button className="bg-white p-4 border border-gray-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  <h3 className="font-medium text-gray-80 mb-1">Search capabilities</h3>
                  <p className="text-sm text-gray-500">Find what you need quickly</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 bg-transparent outline-none py-2 text-gray-700"
              />
              <button
                type="submit"
                className="ml-2 p-2 rounded-full text-blue-600 hover:bg-blue-100 flex-shrink-0 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Notsy AI may produce inaccurate information. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;