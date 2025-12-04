import mongoose from 'mongoose';
import validator from 'validator';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, trim: true, lowercase: true, validate: v => !v || validator.isEmail(v) },
  phone: { type: String, trim: true, maxlength: 30 },
  message: { type: String, trim: true, maxlength: 2000 },
  source: { type: String, trim: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);