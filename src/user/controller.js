import asyncHandler from '../middleware/validate/asyncHandler.js';
import {
  updateLoggedInUser,
  changePassword,
  forgotPasswordWithMasterOtp,
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
} from './service.js';

const updateMyProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateLoggedInUser(
    req.user._id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

const changeMyPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await changePassword(req.user._id, oldPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

const forgotPasswordMOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await forgotPasswordWithMasterOtp(email, otp, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

// const forgotPasswordController = asyncHandler(async (req, res) => {
//   const { email, time, day, month } = req.body;

//   await forgotPassword(email, { time, day, month });

//   res.status(200).json({
//     success: true,
//     message: "OTP request accepted",
//   });
// });

// const resetPasswordController = asyncHandler(async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   await resetPassword(email, otp, newPassword);

//   res.status(200).json({
//     success: true,
//     message: 'Password reset successful'
//   });
// });

// const logoutController = asyncHandler(async (req, res) => {
//   await logoutUser(req.user._id);

//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });






const addMyAddress = asyncHandler(async (req, res) => {
  const address = await addAddress(req.user._id, req.body);

  res.status(201).json({
    success: true,
    data: address
  });
});


const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await getMyAddresses(req.user._id);

  res.status(200).json({
    success: true,
    data: addresses
  });
});


const updateMyAddress = asyncHandler(async (req, res) => {
  const updatedAddress = await updateAddress(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: updatedAddress
  });
});


const deleteMyAddress = asyncHandler(async (req, res) => {
  await deleteAddress(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully"
  });
});


export {
  updateMyProfile,
  changeMyPassword,
  forgotPasswordMOtp,
  addMyAddress,
  getAddresses,
  updateMyAddress,
  deleteMyAddress
};

