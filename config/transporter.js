import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // 🔥 THIS IS THE FIX

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // stop using "service"
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// // 🔥 ADD THIS TEMPORARY DEBUG
// console.log("Transporter USER:", process.env.EMAIL_USER);
// console.log("Transporter PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

export default transporter;
