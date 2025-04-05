import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

const VideoResourceViewer = ({ resource }) => {
  // Add console.log to debug
  console.log('Resource data:', resource);
  
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  // Handle both array and single string cases
  const videos = Array.isArray(resource?.source) ? resource.source : [resource?.source];
  
  // Add console.log to debug videos array
  console.log('Videos array:', videos);

  const getVideoIdFromUrl = (url) => {
    if (!url) return null;
    try {
      const videoUrl = new URL(url);
      const videoId = videoUrl.searchParams.get('v');
      console.log('Video ID extracted:', videoId, 'from URL:', url);
      return videoId;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };

  const currentVideoId = getVideoIdFromUrl(videos[selectedVideoIndex]);

  if (!currentVideoId) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Invalid video source</p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-6">
      <div className="w-3/5 flex flex-col bg-white rounded-xl shadow-sm">
        <Tab.Group defaultIndex={0} onChange={setSelectedVideoIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 m-4">
            {videos.map((_, idx) => (
              <Tab
                key={idx}
                className={({ selected }) => `
                  w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected ? 'bg-white text-primary shadow' : 'text-primary/60'}
                `}
              >
                Video {idx + 1}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="flex-1 p-4">
            {videos.map((video, idx) => (
              <Tab.Panel key={idx} className="h-full">
                <div className="h-full flex flex-col">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${getVideoIdFromUrl(video)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 truncate">{video}</p>
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Chat interface */}
      <div className="w-2/5 bg-white rounded-xl shadow-sm p-6">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {/* Chat messages will go here */}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResourceViewer;