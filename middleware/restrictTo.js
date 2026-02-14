import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 const restrictTo = (...roles) => {
  return (req, res, next) => {

    // protect must run before this
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        'You do not have permission to perform this action'
      );
    }

    next();
  };
};

export default restrictTo;