import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  console.log("Cookies received:", req.cookies); // Debugging

  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You are not authenticated. Please log in to access this resource."));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Invalid token. Please log in again."));

    req.user = user; // Attach user to request
    console.log("Decoded User from Token:", user); // Debugging
    next();
  });
};
