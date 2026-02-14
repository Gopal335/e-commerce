import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { generateOtp } from '../../utils/otpGenerator.js';
import { sendEmail } from '../../utils/sendEmail.js';
import AppError from '../utils/appError.js';


const registerUser = async (name, email, password, phone) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const otpData = generateOtp();

  const user = await User.create({
    name,
    email,
    password,
    phone,
    isEmailVerified: false,
    otp: otpData.hashedOtp,
    otpExpires: otpData.expiresAt,
  });

  await sendEmail({
    email: user.email,
    subject: "Email Verification OTP",
    message: `Your email verification OTP is: ${otpData.otp}`,
  });

  return { message: "OTP sent. Please verify your email." };
};


 const loginUser = async (email, password) => {

  const user = await User.findOne({ "email":email });

//   if (!user.isEmailVerified && user.role!="admin") {
//   throw new AppError("Please verify your email first", 403);
// }


  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};


const sendEmailVerificationOtp = async (email) => {
  const user = await User.findOne({ email });
  console.log(email);
  console.log(user);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 400);
  }

  const otpData = generateOtp();

  user.otp = otpData.hashedOtp;
  user.otpExpires = otpData.expiresAt;

  await user.save();

  const message = `Your email verification OTP is: ${otpData.otp}`;

  await sendEmail({
    email: user.email,
    subject: "Email Verification OTP",
    message,
  });

  return { message: "Verification OTP sent successfully" };
};

const verifyEmail = async (email, otp) => {
  const hashedInputOtp = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  const user = await User.findOne({
    email,
    otp: hashedInputOtp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return { message: "Email verified successfully" };
};





const forgotPassword = async (email, schedule = {}) => {
  const user = await User.findOne({ email });
 if (!user) {
  throw new AppError('User not found', 404);
}


  const { time, day, month } = schedule;

  if (time) {
    const [hours, minutes] = time.split(":");

    const now = new Date();

    
    const scheduledDay = day ?? now.getDate();
    const scheduledMonth = month ?? now.getMonth() + 1; 

    const scheduledDate = new Date();
    scheduledDate.setFullYear(now.getFullYear());
    scheduledDate.setMonth(scheduledMonth - 1);
    scheduledDate.setDate(scheduledDay);
    scheduledDate.setHours(Number(hours));
    scheduledDate.setMinutes(Number(minutes));
    scheduledDate.setSeconds(0);
    scheduledDate.setMilliseconds(0);

   
    if (scheduledDate <= now) {
  throw new AppError('Scheduled time must be in the future', 400);
}


    user.otpScheduleAt = scheduledDate;
    user.otpScheduled = true;

    await user.save();

    return;
  }

 
  const otpData = generateOtp();

  user.otp = otpData.hashedOtp;
  user.otpExpires = otpData.expiresAt;
  user.otpRetryCount = 1;
  user.lastOtpSentAt = new Date();
  user.otpScheduled = false;
  user.otpScheduleAt = undefined;

  await user.save();

  const message = `Your password reset OTP is: ${otpData.otp}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset OTP",
    message,
  });
};



const resetPassword = async (email, otp, newPassword) => {
  const hashedInputOtp = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  const user = await User.findOne({
    email,
    otp: hashedInputOtp,
    otpExpires: { $gt: Date.now() },
  });

  console.log(hashedInputOtp);

 if (!user) {
  throw new AppError('Invalid or expired OTP', 400);
}



  
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpRetryCount = 0;
  user.lastOtpSentAt = undefined;

  await user.save();

  return true;
};


// c13491890a3afd5544b23b0ce15e0d25303f4a9a14a531433c2f2b0b46149082
// fb3e38322b8387b4f0ea370f28a057a568a50b05c6d4d75c6f64c8c2de075731
// fb3e38322b8387b4f0ea370f28a057a568a50b05c6d4d75c6f64c8c2de075731
//$2b$10$jMY1PjbUowIeF/NaCAHpFe5u5ftS9M4nOknoBtRjqOcfZ8VeLA3Oe
// $2b$10$pPalKfpiNLqtzsEl0GxbFuVMKxjcFSDubZ85nsRYAHfkn5kF5s5h6

// bde79a2d163c9c54989459b4f750b0a58fc55912a0463aff00d11bbde7719d55
// bde79a2d163c9c54989459b4f750b0a58fc55912a0463aff00d11bbde7719d55

const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Invalidate refresh token
  user.refreshToken = undefined;

  await user.save();

  return true;
};

export {registerUser, loginUser, verifyEmail, sendEmailVerificationOtp, forgotPassword, resetPassword, logoutUser};