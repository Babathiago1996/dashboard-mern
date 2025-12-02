import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper for token
const sign = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(400).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });

    // Note: using passwordHash field; compare with bcrypt
    const match = await bcrypt.compare(password, user.passwordHash || '');
    if (!match) return res.status(400).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });

    const token = sign(user);
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};
