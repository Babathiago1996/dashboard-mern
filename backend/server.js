import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
// Validate required ENV early
const required = ['MONGO_URI', 'JWT_SECRET'];
for (const name of required) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}. See .env.example`);
    process.exit(1);
  }
}

const app = express();
connectDB();

// Basic middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting (general)
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
