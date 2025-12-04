import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const run = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const pw = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin exists:", email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pw, salt);

  const admin = new User({
    name: "Admin",
    email,
    passwordHash: hash,
    role: "admin",
  });
  await admin.save();
  console.log("Seed admin created:", email);
  process.exit(0);
};

run();
