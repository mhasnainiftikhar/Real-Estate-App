// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-71273.firebaseapp.com",
  projectId: "mern-estate-71273",
  storageBucket: "mern-estate-71273.firebasestorage.app",
  messagingSenderId: "718831544861",
  appId: "1:718831544861:web:d5f04bbbe01a44b526f4f4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);