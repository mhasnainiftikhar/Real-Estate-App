import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios"; 

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    if (!currentUser || !currentUser._id) {
      console.error("User not found or not logged in");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`/api/uploads/${currentUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
    }
  };
  
  

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-center text-3xl font-bold text-blue-700 mb-8">
        Profile
      </h1>

      <form className="flex flex-col items-center space-y-5">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {/* Profile Picture Section */}
        <div className="relative flex flex-col items-center">
          <img
            src={currentUser?.profilePic || "Profile"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-md cursor-pointer"
            onClick={handleProfileClick} 
            onError={(e) => (e.target.src = "Profile")}
          />

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Upload
          </button>
        </div>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="New Password"
          id="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Update Profile Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
        >
          Update Profile
        </button>
      </form>

      {/* Delete & Logout Buttons */}
      <div className="mt-6 flex flex-col space-y-3">
        <button
          className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition duration-300"
        >
          DELETE Account
        </button>
        <button
          className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold shadow-md hover:bg-gray-500 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
