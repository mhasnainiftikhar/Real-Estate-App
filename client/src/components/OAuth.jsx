import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSucess } from "../redux/user/userSlice.js";
import {useNavigate} from 'react-router-dom'

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Allow cookies (JWT)
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          googleId: result.user.uid, // ✅ Ensured correct property
          photoURL: result.user.photoURL,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Google authentication failed");
      }

      const data = await res.json();
      dispatch(signInSucess(data));
      navigate("/"); 
      console.log("Google sign-in success:", data);
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert(error.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="uppercase w-full flex items-center justify-center px-4 py-2 
                 bg-red-600 text-white font-semibold rounded-lg shadow-md 
                 hover:bg-red-700 focus:outline-none focus:ring-2 
                 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
