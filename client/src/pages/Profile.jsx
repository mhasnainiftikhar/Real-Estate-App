import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signInSuccess,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    profilePic: null,
  });

  const fileInputRef = useRef(null);

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
    setIsSubmitting(true);
    setUpdateError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      // First upload the file
      const uploadRes = await axios.post("/api/uploads", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.data && uploadRes.data.filePath) {
        // Then update the user profile with the file path
        const userUpdateData = new FormData();
        userUpdateData.append("profilePic", uploadRes.data.filePath);

        const updateRes = await axios.post(
          `/api/user/update/${currentUser.id}`,
          userUpdateData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setUpdateSuccess(true);
        dispatch(
          signInSuccess({
            ...currentUser,
            profilePic: uploadRes.data.filePath,
          })
        );
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setUpdateError(error.response?.data?.message || "Image upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    const updateData = {
      username: formData.username,
      email: formData.email,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const res = await axios.post(
        `/api/user/update/${currentUser.id}`,
        updateData,
        {
          withCredentials: true,
        }
      );

      setUpdateSuccess(true);
      dispatch(
        signInSuccess({
          ...currentUser,
          username: updateData.username,
          email: updateData.email,
        })
      );

      // Clear password field after successful update
      setFormData({
        ...formData,
        password: "",
      });
    } catch (error) {
      console.error("Update failed:", error);
      setUpdateError(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/user/delete/${currentUser.id}`, {
        withCredentials: true,
      });
      dispatch(deleteUserSuccess());
      navigate("/");
    } catch (error) {
      dispatch(
        deleteUserFailure(error.response?.data?.message || "Delete failed")
      );
    }
  };

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      await axios.get("/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      dispatch(
        signOutFailure(error.response?.data?.message || "Sign out failed")
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      {updateSuccess && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          Profile updated successfully!
        </div>
      )}

      {updateError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {updateError}
        </div>
      )}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div className="relative self-center">
          <img
            src={currentUser?.profilePic || "/default-profile.png"}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            onClick={handleProfilePicClick}
          />
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
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

        <button
          className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>

        <Link
          to={"/create-listing"}
          className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          Create Listing
        </Link>
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
