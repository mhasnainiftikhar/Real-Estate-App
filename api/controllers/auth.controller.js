import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup Controller
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email already in use"));
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
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

    // Check if all fields are provided
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found!!!"));
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token in a HTTP-only cookie
    res
      .cookie("access_token", token, {
        httpOnly: true
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
