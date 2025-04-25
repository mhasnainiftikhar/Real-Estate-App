import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Check for token in cookies first (default method)
  const cookieToken = req.cookies.access_token;
  
  // Check for token in Authorization header (for API calls from frontend)
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;
  
  // Use whichever token is available
  const token = cookieToken || headerToken;

  if (!token) {
    return next(errorHandler(401, 'You are not authenticated'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Token is not valid'));
    }
    
    req.user = user;
    next();
  });
};