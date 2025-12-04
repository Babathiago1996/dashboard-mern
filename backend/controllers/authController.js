import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });

    const match = await user.verifyPassword(password);
    if (!match) return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};
