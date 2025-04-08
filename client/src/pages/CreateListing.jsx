import React, { useState } from "react";
import axios from "axios";

function CreateListing() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset_key = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    if (files.length > 6) {
      console.error("Maximum 6 images allowed.");
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", preset_key);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData
        );
        setImageUrls((prev) => [...prev, res.data.secure_url]);
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }

    setFiles([]); // clear local files after upload
    setUploading(false);
  };

  const handleDelete = (url) => {
    setImageUrls((prev) => prev.filter((img) => img !== url));
  };

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700 mt-10 mb-6">
        Create Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-8">
        {/* Left Form Section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name..."
            id="name"
            required
            maxLength={50}
            minLength={3}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description..."
            id="description"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Address..."
            id="address"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-4">
            {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
              <label key={id} className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  id={id}
                  className="w-5 h-5 accent-blue-600"
                />
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
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
                className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600">Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={0}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-600">
                <p>Regular Price</p>
                <span className="text-xs text-gray-400">($/month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={0}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-600">
                <p>Discounted Price</p>
                <span className="text-xs text-gray-400">($/month)</span>
              </div>
            </div>
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
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {/* Uploaded Images Preview */}
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
            className="bg-blue-600 text-white rounded-lg py-3 mt-auto hover:bg-blue-700 transition"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
