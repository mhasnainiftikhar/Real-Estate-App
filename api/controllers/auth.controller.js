import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Function to generate a random secure password
const generatePassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Signup Controller
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Signin Controller
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
        },
      });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Google OAuth Controller
export const google = async (req, res, next) => {
  try {
    const { email, name, googleId, photoURL } = req.body;

    if (!email || !googleId) {
      return next(errorHandler(400, "Google login failed. Try again."));
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        username: name,
        email,
        password: hashedPassword,
        profilePic: photoURL,
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Google OAuth login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
        },
      });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
