import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const run = async () => {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const pw = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in environment - cannot seed');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  if (pw.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 chars');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pw, salt);

  const admin = new User({
    name: 'Admin',
    email,
    passwordHash: hash,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user created:', email);
  process.exit(0);
};

run();
