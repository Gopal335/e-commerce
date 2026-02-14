import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};



/*
  =========================================
  PROTECT MIDDLEWARE (Authentication)
  =========================================
*/

/*
  =========================================
  RESTRICT TO (Authorization / RBAC)
  =========================================

  Usage:
  restrictTo('admin')
  restrictTo('admin', 'manager')
*/

//  export const restrictTo = (...roles) => {
//   return (req, res, next) => {

//     // protect must run before this
//     if (!req.user) {
//       res.status(401);
//       throw new Error('Not authorized, please login');
//     }

//     if (!roles.includes(req.user.role)) {
//       res.status(403);
//       throw new Error(
//         'You do not have permission to perform this action'
//       );
//     }

//     next();
//   };
// };

export default protect;