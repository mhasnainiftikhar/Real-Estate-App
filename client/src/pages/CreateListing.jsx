import React from "react";

function CreateListing() {
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
            type="text"
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
            {[
              { id: "sale", label: "Sell" },
              { id: "rent", label: "Rent" },
              { id: "parking", label: "Parking Spot" },
              { id: "furnished", label: "Furnished" },
              { id: "offer", label: "Offer" },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" id={item.id} className="w-5 h-5 accent-blue-600" />
                {item.label}
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
              Images:{" "}
              <span className="text-xs font-normal text-gray-500 ml-1">
                The first image will be the cover (max 6)
              </span>
            </p>

            <input
              type="file"
              id="images"
              accept="images/*"
              multiple
              className="border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
            />

            <button
              type="button"
              className="border border-blue-600 text-blue-600 rounded-lg py-2 hover:bg-blue-50 transition"
            >
              Upload
            </button>
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
