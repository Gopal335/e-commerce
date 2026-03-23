import cron from "node-cron";
import User from "../../models/User.js";
import { generateOtp } from "../../utils/otpGenerator.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const otpCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      const users = await User.find({
        otpScheduled: true,
        otpScheduleAt: { $lte: now },
      });
      for (const user of users) {
        const otpData = generateOtp();
        user.otp = otpData.hashedOtp;
        user.otpExpires = otpData.expiresAt;
        user.otpRetryCount = 1;
        user.lastOtpSentAt = new Date();

        user.otpScheduled = false;
        user.otpScheduleAt = undefined;
        await user.save();
        const message = `Your scheduled OTP is: ${otpData.otp}`;
        await sendEmail({
          email: user.email,
          subject: "Scheduled Password Reset OTP",
          message,
        });
        console.log(` Scheduled OTP sent to ${user.email}`);
      }
    } catch (error) {
      console.error(" OTP Cron Error:", error.message);
    }
  });
};
