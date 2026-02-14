import * as authService from './service.js';
import asyncHandler from '../../middleware/asyncHandler.js';



const signup = asyncHandler(async (req, res) => {

  const { name, email, password,phone } = req.body;

  const { user, accessToken, refreshToken } =
    await authService.registerUser(name, email, password,phone);

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    accessToken,
    user,
  });
});


 const signin = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const { user, accessToken, refreshToken } =
    await authService.loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    accessToken
  });
});


/**
 * Send Verification OTP
 */
const sendVerificationOtpController = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const response = await authService.sendEmailVerificationOtp(email);

    res.status(200).json({
      success: true,
      ...response,
    })
  }
);

/**
 * Verify Email Controller
 */
const verifyEmailController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const response = await authService.verifyEmail(email, otp);

  res.status(200).json({
    success: true,
    ...response,
  });
});

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email, time, day, month } = req.body;

  await authService.forgotPassword(email, { time, day, month });

  res.status(200).json({
    success: true,
    message: "OTP request accepted",
  });
});




const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await authService.resetPassword(email, otp, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

const logoutController = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});


export {signup, signin, sendVerificationOtpController, verifyEmailController, logoutController, resetPasswordController, forgotPasswordController};