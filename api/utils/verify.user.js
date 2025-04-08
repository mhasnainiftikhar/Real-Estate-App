import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  // Ensure cookies are parsed
  const cookies = req.cookies;
  if (!cookies) {
    console.log('⚠️ No cookies found on the request.');
    return next(errorHandler(400, 'Cookies are missing. Please enable cookies and try again.'));
  }

  // Debug logging
  console.log('✅ Cookies received:', cookies);

  const token = cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'You are not authenticated. Please log in to access this resource.'));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.error('❌ JWT verification error:', err);
      return next(errorHandler(403, 'Invalid or expired token. Please log in again.'));
    }

    req.user = decodedUser; // Attach user info to the request
    console.log('✅ Decoded user from token:', decodedUser);
    next();
  });
};
