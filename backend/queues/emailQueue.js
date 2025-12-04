import Queue from 'bull';
import { sendNotification } from '../utils/email.js';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const emailQueue = new Queue('emailQueue', redisUrl);

emailQueue.process(async (job) => {
  const { to, subject, html, text } = job.data;
  return sendNotification({ to, subject, html, text });
});

emailQueue.on('failed', (job, err) => {
  console.error('Email job failed', job.id, err);
});

export default emailQueue;