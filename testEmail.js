import dotenv from "dotenv";
dotenv.config();

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

import transporter from "./config/transporter.js";

async function test() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "If you got this, email works.",
    });

    console.log("✅ EMAIL SENT");
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
  }
}

test();
