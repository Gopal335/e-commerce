import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 🔥 Check if admin already exists
    // const adminExists = await User.findOne({ role: 'admin' });

    // if (adminExists) {
    //   console.log("⚠️ Admin already exists.");
    //   process.exit();
    // }

    // Create admin
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE,
      password: process.env.ADMIN_PASSWORD, // will be hashed automatically
      role: "admin"
    });

    console.log("🔥 Admin Created Successfully!");
    console.log({
      id: admin._id,
      email: admin.email
    });

    process.exit();

  } catch (error) {

    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);

  }
};

seedAdmin();
