import crypto from "crypto";

export const generateOtp = () => {
  // 6 digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP before saving to DB
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  return {
    otp,
    hashedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
};
