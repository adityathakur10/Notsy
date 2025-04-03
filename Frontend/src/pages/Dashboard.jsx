import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const decoded = jwt_decode(token);
        setUserName(decoded.name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div
      className="flex justify-center h-screen bg-base-white"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="flex flex-col text-center items-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Notsy, {userName}!</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-primary px-6 py-3 text-base-white rounded-lg"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
