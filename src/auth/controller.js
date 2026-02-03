import * as authService from './service.js';
import asyncHandler from '../../middleware/asyncHandler.js';

const signup = asyncHandler(async (req, res) => {

  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});


 const signin = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    data: user
  });
});

export {signup, signin};