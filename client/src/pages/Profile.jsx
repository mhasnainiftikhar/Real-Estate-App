import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  deleteUserStart,
  deleteUserSucess,
  deleteUserFailure,
  signInSucess,
  signOutStart,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    profilePic: null,
  });

  const fileInputRef = useRef(null); // Reference to the file input

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, profilePic: selectedFile });
      handleUploadImage(selectedFile);
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  // Handle uploading image to the server
  const handleUploadImage = async (file) => {
    const formDataToSend = new FormData();
    formDataToSend.append("profilePic", file);

    try {
      const res = await axios.post(
        `/api/user/update/${currentUser.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(signInSucess({ ...currentUser, ...res.data.user }));
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    }
  };

  // Handle user update (excluding image upload)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);

    try {
      const res = await axios.post(
        `/api/user/update/${currentUser.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(signInSucess({ ...currentUser, ...res.data.user }));
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  // Handle user delete
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/user/delete/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      dispatch(deleteUserSucess());
      navigate("/");
    } catch (error) {
      dispatch(
        deleteUserFailure(error.response?.data?.message || "Delete failed")
      );
      alert("Delete failed");
    }
  };
  // Handle user sign out
  const handleSignOut = async () => {
   try {
      dispatch(signOutStart());
      await axios.get("/api/auth/signout", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      dispatch(signInSucess(null));
      navigate("/");
    } catch (error) {
      dispatch(signOutStart(error.response?.data?.message || "Sign out failed"));
      alert("Sign out failed");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <img
          src={currentUser?.profilePic || "/default-profile.png"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={handleProfilePicClick}
        />
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Username"
        />
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Email"
        />
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="New Password"
        />
        <button className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
    </div>
  );
}
