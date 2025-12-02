import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    validate: { validator: validator.isEmail, message: 'Invalid email' }
  },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }, // admin by default for MMP seed; change as needed
}, { timestamps: true });

userSchema.methods.verifyPassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified || !this.isModified('passwordHash')) return next();
  // If you store raw password as passwordHash accidentally, ensure it's hashed elsewhere; here we assume seed sets hashed.
  next();
});

export default mongoose.model('User', userSchema);
