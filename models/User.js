import mongoose from 'mongoose';
import { hashPasswordMiddleware } from '../utils/hashPassword.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'], // 🔥 restrict values
    default: 'user'
  },
  otp: { type: String },
otpExpires: { type: Date },
otp: String,
otpExpires: Date,

otpRetryCount: {
  type: Number,
  default: 0,
},

lastOtpSentAt: {
  type: Date,
},

otpScheduleAt: {
  type: Date,
},

otpScheduled: {
  type: Boolean,
  default: false,
},
refreshToken: {
  type: String,
}
,
isEmailVerified: {
  type: Boolean,
  default: false
},

emailOtp: String,
emailOtpExpires: Date,
addresses: [
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }
]


}, { timestamps: true });

// Attach the external middleware logic
userSchema.pre('save', hashPasswordMiddleware);

export default mongoose.model('User', userSchema);