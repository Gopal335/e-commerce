import cron from "node-cron";
import User from "../models/User.js";
import { generateOtp } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";

export const otpCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏰ OTP Cron running...");

    try {
      const now = Date.now();

      const users = await User.find({
        otp: { $ne: null },
        otpExpires: { $gt: now }, // OTP still valid
        otpRetryCount: { $lt: 5 }, // 🔥 MAX 5 TIMES
        lastOtpSentAt: { $lt: new Date(now - 60 * 1000) }, // 🔥 1 minute gap
      });

      for (const user of users) {
        const otpData = generateOtp();

        user.otp = otpData.hashedOtp;
        user.otpExpires = otpData.expiresAt;
        user.otpRetryCount += 1;
        user.lastOtpSentAt = new Date();

        await user.save();

        const message = `Your password reset OTP is: ${otpData.otp}. It expires in 10 minutes. (Attempt ${user.otpRetryCount}/5)`;

        await sendEmail({
          email: user.email,
          subject: "Password Reset OTP",
          message,
        });

        console.log(
          `📧 OTP sent to ${user.email} (${user.otpRetryCount}/5)`
        );
      }
    } catch (error) {
      console.error("❌ OTP Cron Error:", error.message);
    }
  });
};
