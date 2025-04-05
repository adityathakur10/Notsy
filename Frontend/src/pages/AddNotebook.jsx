import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
import axios from "../utils/axios";

const AddNotebook = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const imageOptions = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  const handleImageCompress = async (file) => {
    try {
      const compressedFile = await imageCompression(file, imageOptions);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, JPG, PNG)");
      return;
    }

    // Validate file size (max 2MB as per backend)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    try {
      const compressedFile = await handleImageCompress(file);
      setCoverImage(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error("Error processing image");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB in bytes
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a notebook name");
      return;
    }

    if (name.trim().length > 20) {
      toast.error("Notebook name should be less than 20 characters");
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("name", name.trim());

      // Create a File object from the compressed image blob
      const imageFile = new File([coverImage], coverImage.name || "cover.jpg", {
        type: coverImage.type,
      });
      formData.append("coverImage", imageFile);

      const response = await axios.post("/folder", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Notebook created successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating notebook:", error);
      if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/auth/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.msg || "Invalid input");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.response?.data?.msg || "Failed to create notebook");
      }
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
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl shadow-sm"
        >
          <div>
            <div
              {...getRootProps()}
              className={`flex items-center justify-center border-2 border-dashed 
              ${isDragActive ? "border-white" : "border-gray-300"} 
              rounded-lg p-14 cursor-pointer transition-colors`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImage(null);
                      setPreviewUrl("");
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-base-white text-center">
                  {isDragActive ? (
                    <p>Drop the image here ...</p>
                  ) : (
                    <p>Drag & drop an image here, or click to select</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="px-10 flex flex-col gap-10">
            <h1 className="text-3xl text-center font-semibold text-base-white">
              Create a new notebook
            </h1>
            <div>
              <label className="block text-lg text-base-white font-medium mb-2">
                Title <span className="text-sm">(max 20 characters)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter notebook name"
              />
              {name.length > 0 && (
                <p className="text-sm text-white/70 mt-1">
                  {20 - name.length} characters remaining
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 px-10 pb-10 py-5">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2 bg-[#362374] text-white rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2b1c5d]"
              }`}
            >
              {loading ? "Creating..." : "Create"}
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
