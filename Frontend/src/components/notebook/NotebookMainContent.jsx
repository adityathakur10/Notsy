import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const NotebookMainContent = ({ notebook, topics, loading, onAddTopic, onDeleteTopic }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full gap-10 h-full">
        {/* Left Section */}
        <div className="flex flex-col gap-5 w-[40%] h-full">
          <div
            className="flex flex-col items-start justify-center p-8 w-full h-[45%] rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${assets.WelcomeCard})` }}
          >
            <h2 className="text-4xl font-normal text-[#BFA7FF] drop-shadow-md">
              {notebook?.name || 'Notebook'}
            </h2>
            <h1 className="text-5xl font-semibold text-base-white drop-shadow-lg">
              Topics
            </h1>
          </div>

          <div className="w-full flex-1 rounded-xl bg-base-white p-6">
            <button
              onClick={onAddTopic}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Add New Topic
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[60%] h-full rounded-xl bg-base-white p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Topics List</h2>
              {topics.map((topic) => (
                <div 
                  key={topic._id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-medium">{topic.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => navigate(`/topic/${topic._id}`)}
                      className="text-sm text-primary hover:text-primary-hover"
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => onDeleteTopic(topic._id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {(!topics || topics.length === 0) && (
                <p className="text-center text-gray-500">
                  No topics yet. Create your first one!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookMainContent;