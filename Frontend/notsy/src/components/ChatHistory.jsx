import React from 'react';

const ChatHistory = ({ conversations, activeConversation, onSelectConversation, onNewChat }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center transition duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length > 0 ? (
          <ul className="space-y-2 py-2">
            {conversations.map(conversation => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left px-4 py-3 rounded-md flex flex-col transition duration-200 ${
                    activeConversation === conversation.id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`font-medium truncate ${activeConversation === conversation.id ? 'text-blue-50' : 'text-gray-50'}`}>
                    {conversation.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {conversation.timestamp}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            No conversations yet
          </div>
        )}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-800">User</div>
            <span className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition">
              Sign out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;