import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function CreateListing() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset_key = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }
    if (files.length > 6) {
      setError("Maximum 6 images allowed");
      return;
    }

    setUploading(true);
    setError("");
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append("file", files[i]);
      data.append("upload_preset", preset_key);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          data
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Failed to upload images. Please try again.");
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setFiles([]);
    setUploading(false);
  };

  const handleDelete = (url) => {
    setImageUrls((prev) => prev.filter((img) => img !== url));
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    if (formData.regularPrice <= 0) {
      setError("Regular price must be greater than 0");
      return;
    }

    if (formData.offer && formData.discountedPrice >= formData.regularPrice) {
      setError("Discounted price must be less than regular price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const listingData = {
        ...formData,
        imageUrls: imageUrls,
        userRef: currentUser.id, // Add user reference
        // Make sure we're using the backend field names correctly
        regularPrice: formData.regularPrice,
        discountedPrice: formData.discountedPrice,
      };

      const response = await axios.post("/api/listing/create", listingData, {
        withCredentials: true,
      });

      setSuccess(true);
      setLoading(false);

      // Reset form after submission
      setFormData({
        name: "",
        description: "",
        address: "",
        type: "rent",
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 0,
      });
      setImageUrls([]);

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Failed to create listing. Please try again."
      );
    }
  };

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700 mt-10 mb-6">
        Create Listing
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
          Listing created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        {/* Left Form Section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name..."
            id="name"
            required
            maxLength={50}
            minLength={3}
            onChange={handleChange}
            value={formData.name}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description..."
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Address..."
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Sell</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Rent</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Parking Spot</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Furnished</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Offer</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600">Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600">Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="border border-gray-300 rounded-lg px-4 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-600">
                <p>Regular Price</p>
                <span className="text-xs text-gray-400">
                  {formData.type === "rent" ? "($/month)" : "($)"}
                </span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={formData.regularPrice - 1}
                  required
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-600">
                  <p>Discounted Price</p>
                  <span className="text-xs text-gray-400">
                    {formData.type === "rent" ? "($/month)" : "($)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-gray-700">
              Images:
              <span className="text-xs font-normal text-gray-500 ml-1">
                The first image will be the cover (max 6)
              </span>
            </p>

            <input
              onChange={handleFileChange}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className={`border border-blue-600 text-blue-600 rounded-lg py-2 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Images"
              )}
            </button>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className={`bg-blue-600 text-white rounded-lg py-3 mt-auto transition ${
              loading || uploading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Listing"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
