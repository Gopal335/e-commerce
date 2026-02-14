import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import {generateOtp} from '../../utils/otpGenerator.js';
import {sendEmail} from '../../utils/sendEmail.js';
import crypto from 'crypto';
import AppError from '../utils/appError.js';

const updateLoggedInUser = async (userId, updateData) => {

  const allowedFields = ['name','email','phone'];

  const filteredData = {};

  allowedFields.forEach(field=>{
    if(updateData[field]){
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new:true, runValidators:true }
  ).select('-password');

  if (!user) {
  throw new AppError('User not found', 404);
}


  return user;
};




const changePassword = async (userId, oldPassword, newPassword) => {

  const user = await User.findById(userId);

   if (!user) {
  throw new AppError('User not found', 404);
}

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
  throw new AppError('Old password is incorrect', 400);
}


  
  user.password = newPassword;

  await user.save();

  return true;
};





const forgotPasswordWithMasterOtp = async (
  email,
  otp,
  newPassword
) => {

  if (otp !== process.env.MASTER_OTP) {
  throw new AppError('Invalid OTP', 400);
}


  const user = await User.findOne({ email });

  if (!user) {
  throw new AppError('User not found', 404);
}


  user.password = newPassword;

  await user.save();

  return true;
};



// const forgotPassword = async (email, schedule = {}) => {
//   const user = await User.findOne({ email });
//  if (!user) {
//   throw new AppError('User not found', 404);
// }


//   const { time, day, month } = schedule;

//   if (time) {
//     const [hours, minutes] = time.split(":");

//     const now = new Date();

    
//     const scheduledDay = day ?? now.getDate();
//     const scheduledMonth = month ?? now.getMonth() + 1; 

//     const scheduledDate = new Date();
//     scheduledDate.setFullYear(now.getFullYear());
//     scheduledDate.setMonth(scheduledMonth - 1);
//     scheduledDate.setDate(scheduledDay);
//     scheduledDate.setHours(Number(hours));
//     scheduledDate.setMinutes(Number(minutes));
//     scheduledDate.setSeconds(0);
//     scheduledDate.setMilliseconds(0);

   
//     if (scheduledDate <= now) {
//   throw new AppError('Scheduled time must be in the future', 400);
// }


//     user.otpScheduleAt = scheduledDate;
//     user.otpScheduled = true;

//     await user.save();

//     return;
//   }

 
//   const otpData = generateOtp();

//   user.otp = otpData.hashedOtp;
//   user.otpExpires = otpData.expiresAt;
//   user.otpRetryCount = 1;
//   user.lastOtpSentAt = new Date();
//   user.otpScheduled = false;
//   user.otpScheduleAt = undefined;

//   await user.save();

//   const message = `Your password reset OTP is: ${otpData.otp}`;

//   await sendEmail({
//     email: user.email,
//     subject: "Password Reset OTP",
//     message,
//   });
// };



// const resetPassword = async (email, otp, newPassword) => {
//   const hashedInputOtp = crypto
//     .createHash("sha256")
//     .update(String(otp))
//     .digest("hex");

//   const user = await User.findOne({
//     email,
//     otp: hashedInputOtp,
//     otpExpires: { $gt: Date.now() },
//   });

//  if (!user) {
//   throw new AppError('Invalid or expired OTP', 400);
// }



  
//   user.password = newPassword;
//   user.otp = undefined;
//   user.otpExpires = undefined;
//   user.otpRetryCount = 0;
//   user.lastOtpSentAt = undefined;

//   await user.save();

//   return true;
// };


// // c13491890a3afd5544b23b0ce15e0d25303f4a9a14a531433c2f2b0b46149082
// // fb3e38322b8387b4f0ea370f28a057a568a50b05c6d4d75c6f64c8c2de075731
// // fb3e38322b8387b4f0ea370f28a057a568a50b05c6d4d75c6f64c8c2de075731
// //$2b$10$jMY1PjbUowIeF/NaCAHpFe5u5ftS9M4nOknoBtRjqOcfZ8VeLA3Oe
// // $2b$10$pPalKfpiNLqtzsEl0GxbFuVMKxjcFSDubZ85nsRYAHfkn5kF5s5h6


// const logoutUser = async (userId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new AppError('User not found', 404);
//   }

//   // Invalidate refresh token
//   user.refreshToken = undefined;

//   await user.save();

//   return true;
// };


/* ==============================
   ADDRESS SERVICES
============================== */

const addAddress = async (userId, addressData) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // If this address is default → unset previous defaults
  if (addressData.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses.push(addressData);

  await user.save();

  return user.addresses[user.addresses.length - 1];
};


const getMyAddresses = async (userId) => {

  const user = await User.findById(userId).select('addresses');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user.addresses;
};


const updateAddress = async (userId, addressId, updateData) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // If updating default → unset others
  if (updateData.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  Object.keys(updateData).forEach(key => {
    address[key] = updateData[key];
  });

  await user.save();

  return address;
};


const deleteAddress = async (userId, addressId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  address.deleteOne();

  await user.save();

  return true;
};




export { updateLoggedInUser, changePassword, forgotPasswordWithMasterOtp, addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
 };
