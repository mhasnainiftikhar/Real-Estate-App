import React from "react";

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Welcome to our Real Estate website!
      </h1>
      <p className="text-gray-700 mb-4">
        Find your dream property with us. Browse through our extensive listings
        of homes, apartments, and commercial properties.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Featured properties would go here */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">Featured Property</h3>
            <p className="text-gray-600">Placeholder for property details</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
