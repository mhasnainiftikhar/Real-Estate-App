import React from "react";
import { FaSearch } from "react-icons/fa";
import {Link, Links} from "react-router-dom"

function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <Link to="/" >
      <h1 className="flex items-center text-xl sm:text-2xl font-bold">
        <span className="text-4xl font-extrabold text-blue-600">Hasnain</span>
        <span className="text-3xl font-extrabold text-gray-500 ml-2">Estate</span>
      </h1>
      </Link>
      <form className="relative w-full max-w-sm flex items-center">
        <input
          type="text"
          placeholder="Search for properties..."
          className="w-full p-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <FaSearch className="absolute left-3 text-gray-400 text-lg" />
      </form>
      <ul className="flex gap-6 text-lg font-medium">
        <Link to='/'>
        <li className="hidden sm:inline hover:text-blue-500 transition duration-300 cursor-pointer">Home</li></Link>
        <Link to='/about'>
        <li className="hidden sm:inline hover:text-blue-500 transition duration-300 cursor-pointer">About</li></Link>
        <Link to='/sign-in'> 
        <li className="hover:text-blue-500 transition duration-300 cursor-pointer">SignIn</li></Link>
      </ul>
    </header>
  );
}

export default Header;
