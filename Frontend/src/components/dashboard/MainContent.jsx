import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import NotebookCard from "./NotebookCard";
import axios from "../../utils/axios";
import GraphViewer from "../graph/GraphViewer";

const MainContent = ({ notebooks = [], loading, onDeleteNotebook }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchTopicsAndResources = async () => {
      if (!notebooks.length) return;

      try {
        // Fetch topics for all notebooks
        const topicPromises = notebooks.map((notebook) =>
          axios.get(`/folder/${notebook._id}`)
        );

        const topicResponses = await Promise.all(topicPromises);

        // Combine all topics
        const allTopics = topicResponses.reduce((acc, response) => {
          return [...acc, ...(response.data.topics || [])];
        }, []);

        setTopics(allTopics);

        // Now fetch resources for all topics
        const resourcePromises = allTopics.map((topic) =>
          axios.get(`/topic/${topic._id}`)
        );

        const resourceResponses = await Promise.all(resourcePromises);

        // Combine all resources
        const allResources = resourceResponses.reduce((acc, response) => {
          return [...acc, ...(response.data.resources || [])];
        }, []);

        setResources(allResources);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchTopicsAndResources();
  }, [notebooks]);

  return (
    <>
      <div className="h-full flex flex-col gap-6">
        <div className="flex gap-6 h-[65%]">
          {/* Stats Section */}
          <div className="w-[40%] flex flex-col gap-5">
            <div
              className="flex flex-col items-start justify-center p-8 w-full h-[45%] rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${assets.WelcomeCard})` }}
            >
              <h2 className="text-4xl font-normal text-[#BFA7FF] drop-shadow-md">
                Welcome
              </h2>
              <h1 className="text-5xl font-semibold text-base-white drop-shadow-lg text-nowrap">
                {user?.name || "Govind Skysik"}
              </h1>
            </div>

            <div
              className="w-full h-[65%] flex flex-col rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${assets.ProgressSection})` }}
            >
              <div className="flex flex-col gap-10 text-[#309B59] justify-between items-end p-8 h-full rounded-xl">
                <div className="flex w-full relative items-center justify-between h-[60%]">
                  <h2 className="text-3xl absolute bottom-[-20px] font-medium">
                    Total Notebooks
                  </h2>
                  <h1 className="text-9xl absolute right-0 font-semibold drop-shadow-lg text-nowrap">
                    {notebooks.length}
                  </h1>
                </div>
                <div className="flex pr-16 justify-between items-end w-full h-[40%]">
                  <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-semibold">🔥20</h1>
                    <h2 className="pl-4">Days Streak</h2>
                  </div>
                  <div>
                    <h1 className="text-4xl font-semibold">⌛15</h1>
                    <h2 className="pl-2">Total Hours</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="w-[60%] h-full rounded-xl">
            <GraphViewer
              notebooks={notebooks}
              topics={topics}
              resources={resources}
            />
          </div>
        </div>

        <div className="w-full h-[35%] pt-5">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notebooks?.map((notebook) => (
                <NotebookCard
                  key={notebook._id}
                  notebook={notebook}
                  onDelete={onDeleteNotebook}
                />
              ))}

              {(!notebooks || notebooks.length === 0) && (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-500">
                    No notebooks yet. Create your first one!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainContent;
