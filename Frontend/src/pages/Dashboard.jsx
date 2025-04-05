import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Menu from "../components/dashboard/Menu";
import MainContent from "../components/dashboard/MainContent";
import { mockFolderService } from "../utils/mockData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard mounted");
    const fetchNotebooks = async () => {
      try {
        setLoading(true);
        console.log("Fetching notebooks...");
        const response = await mockFolderService.getAllFolders();
        console.log("Notebooks received:", response.folders);
        setNotebooks(response.folders);
      } catch (error) {
        console.error("Error fetching notebooks:", error);
        toast.error("Failed to load notebooks");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotebooks();
  }, []);

  const handleAddNotebook = async (notebookData) => {
    try {
      const response = await mockFolderService.createFolder(notebookData);
      setNotebooks(prevNotebooks => {
        // Check if notebook already exists
        const exists = prevNotebooks.some(n => n._id === response.folder._id);
        if (!exists) {
          return [...prevNotebooks, response.folder];
        }
        return prevNotebooks;
      });
      toast.success("Notebook created successfully");
    } catch (error) {
      console.error("Error creating notebook:", error);
      toast.error("Failed to create notebook");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.dashboardbg})` }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 backdrop-blur-sm">
            <Menu 
              notebooks={notebooks} 
              onAddNotebook={handleAddNotebook}
              loading={loading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-5">
            <div className="backdrop-blur-sm bg-base-white p-7 h-full rounded-xl shadow-sm">
              <MainContent 
                notebooks={notebooks}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
