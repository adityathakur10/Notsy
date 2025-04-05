import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
import { mockFolderService } from "../utils/mockData";

const AddNotebook = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a notebook name");
      return;
    }

    try {
      setLoading(true);
      // Create notebook using mock service
      const response = await mockFolderService.createFolder({ 
        name: name.trim(),
        coverImage: previewUrl || undefined
      });

      toast.success("Notebook created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating notebook:", error);
      toast.error("Failed to create notebook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundImage: `url(${assets.modalBg})` }}
    >
      <div className="w-[40%] shadow-2xl rounded-xl mx-auto bg-primary">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl shadow-sm">
          <div>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-14">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setPreviewUrl("");
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer text-center">
                  <div className="text-base-white">Click to upload image</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="px-10 flex flex-col gap-10">
            <h1 className="text-3xl text-center font-semibold text-base-white">
              Create a new notebook
            </h1>
            <div>
              <label className="block text-lg text-base-white font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter notebook name"
              />
            </div>
          </div>

          <div className="flex gap-4 px-10 pb-10 py-5">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2 bg-[#362374] text-white rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2b1c5d]'
              }`}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/dashboard")}
              className="px-8 py-2 text-white bg-[#362374] hover:bg-[#2b1c5d] rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotebook;
