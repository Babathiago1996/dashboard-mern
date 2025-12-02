import express from 'express';
import { login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginLimiter, validate(loginSchema), login);

export default router;