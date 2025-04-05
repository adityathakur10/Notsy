import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Menu from "../components/dashboard/Menu";
import MainContent from "../components/dashboard/MainContent";
import axios from "../utils/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notebooks function
  const fetchNotebooks = async () => {
    try {
      const response = await axios.get("/folder");
      setNotebooks(response.data.folders);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      toast.error("Failed to fetch notebooks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const handleAddNotebook = async (notebookData) => {
    try {
      const response = await axios.post("/folder", notebookData);
      setNotebooks((prevNotebooks) => [...prevNotebooks, response.data.folder]);
      toast.success("Notebook created successfully");
    } catch (error) {
      console.error("Error creating notebook:", error);
      toast.error(error.response?.data?.msg || "Failed to create notebook");
    }
  };

  // Delete notebook handler with optimistic updates
  const handleDeleteNotebook = async (notebookId) => {
    try {
      // Store current notebooks state for rollback
      const previousNotebooks = notebooks;

      // Optimistically update UI
      setNotebooks((prevNotebooks) =>
        prevNotebooks.filter((notebook) => notebook._id !== notebookId)
      );

      // Make API call
      await axios.delete(`/folder/${notebookId}`);

      // Show success message
      toast.success("Notebook deleted successfully");
    } catch (error) {
      console.error("Error deleting notebook:", error);

      // Rollback on error
      setNotebooks(previousNotebooks);
      toast.error(error.response?.data?.message || "Failed to delete notebook");

      // Refresh notebooks list
      fetchNotebooks();
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
                onDeleteNotebook={handleDeleteNotebook}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
