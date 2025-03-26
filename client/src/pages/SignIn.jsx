import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSucess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart()); 

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSucess(data)); 
        navigate("/");
      } else {
        dispatch(signInFailure(data.message || "Sign-in failed. Please try again."));
      }
    } catch (error) {
      dispatch(signInFailure("Network error. Please check your connection."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl text-center font-semibold mb-6 text-blue-600">
          Sign In
        </h1>

        {error && <p className="text-center mb-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition duration-200"
              type="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition duration-200"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col space-y-2">
            <button
              className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 uppercase disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <OAuth/>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="flex mt-6">
          <p className="text-sm text-gray-500">Don't have an account?</p>
          <Link to="/sign-up">
            <span className="ml-2 text-blue-600 underline hover:text-blue-500 transition duration-200">
              Sign Up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
