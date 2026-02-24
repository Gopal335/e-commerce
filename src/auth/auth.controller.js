import * as authService from './auth.service.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import {getLoggedInUser,
  updateLoggedInUser,
  changePassword,
  forgotPasswordWithMasterOtp} from './auth.service.js';

/* ======================================
   SIGNUP
====================================== */
const signup = asyncHandler(async (req, res) => {

  const { name, email, password, phone } = req.body;

  const result = await authService.registerUser(
    name,
    email,
    password,
    phone
  );

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    accessToken: result.accessToken,
  });

});


/* ======================================
   SIGNIN
====================================== */
const signin = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const result = await authService.loginUser(
    email,
    password
  );

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    accessToken: result.accessToken,
  });

});


/* ======================================
   SEND OTP
====================================== */
const sendVerificationOtpController = asyncHandler(async (req, res) => {

  const { email } = req.body;

  const response =
    await authService.sendEmailVerificationOtp(email);

  res.status(200).json({
    success: true,
    ...response,
  });

});


/* ======================================
   VERIFY EMAIL
====================================== */
const verifyEmailController = asyncHandler(async (req, res) => {

  const { email, otp } = req.body;

  const response =
    await authService.verifyEmail(email, otp);

  res.status(200).json({
    success: true,
    ...response,
  });

});


/* ======================================
   FORGOT PASSWORD
====================================== */
const forgotPasswordController = asyncHandler(async (req, res) => {

  const { email } = req.body;

  const response =
    await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    ...response,
  });

});


/* ======================================
   RESET PASSWORD
====================================== */
const resetPasswordController = asyncHandler(async (req, res) => {

  const { email, otp, newPassword } = req.body;

  const result =
    await authService.resetPassword(
      email,
      otp,
      newPassword
    );

  res.status(200).json({
    success: true,
    ...result
  });

});


/* ======================================
   LOGOUT
====================================== */
const logoutController = asyncHandler(async (req, res) => {

  const result =
    await authService.logoutUser(req.user._id);

  res.status(200).json({
    success: true,
    ...result
  });

});



/* ======================================
   GET PROFILE
====================================== */
const getProfile = asyncHandler(async (req, res) => {

  const user = await getLoggedInUser(req.user.id);

  res.json({
    success: true,
    data: user
  });

});


/* ======================================
   UPDATE PROFILE
====================================== */
const updateProfile = asyncHandler(async (req, res) => {

  const user = await updateLoggedInUser(
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    data: user
  });

});


/* ======================================
   UPDATE PASSWORD
====================================== */
const updatePassword = asyncHandler(async (req, res) => {

  await changePassword(
    req.user.id,
    req.body.oldPassword,
    req.body.newPassword
  );

  res.json({
    success: true,
    message: "Password updated successfully"
  });

});


/* ======================================
   FORGOT PASSWORD
====================================== */
const forgotPassword = asyncHandler(async (req, res) => {

  await forgotPasswordWithMasterOtp(
    req.body.email,
    req.body.otp,
    req.body.newPassword
  );

  res.json({
    success: true,
    message: "Password reset successful"
  });

});

export {
  signup,
  signin,
  sendVerificationOtpController,
  verifyEmailController,
  logoutController,
  resetPasswordController,
  forgotPasswordController,
 getProfile,
  updateProfile,
  updatePassword,
  forgotPassword
};
