import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  return (
    <div 
      className="w-full h-screen bg-gray-50"
      style={{ 
        backgroundImage: `url(${assets.dashboardbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="bg-white h-full rounded-xl shadow-sm overflow-auto">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
