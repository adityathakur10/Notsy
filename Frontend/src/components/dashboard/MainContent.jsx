import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const MainContent = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  return (
    <>
    <div className="flex flex-col text-center items-center space-y-4">
        <h1 className="text-4xl font-bold">
          Welcome to Notsy, {user?.name || "User"}!
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-primary px-6 py-3 text-base-white rounded-lg hover:bg-primary-hover transition-all"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </>
  );
};

export default MainContent;
