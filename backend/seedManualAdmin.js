import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.js";
import connectDB from "./config/db.js";

const run = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Check if admin already exists
    const exists = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (exists) {
      console.log("Admin already exists:", exists.email);
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      name: "Admin User",
      email: process.env.SEED_ADMIN_EMAIL,
      passwordHash: process.env.SEED_ADMIN_PASSWORD,  // <-- your model will hash automatically
      role: "admin"
    });

    console.log("Admin created:", admin.email);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
