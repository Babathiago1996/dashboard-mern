import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@yourdomain.com';
const EMAIL_TO = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';

let resendClient;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

export const sendNotification = async ({ to = EMAIL_TO, subject = 'Notification', text = '', html = '' }) => {
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html: html ||` <pre>${text}</pre>`
      });
      return true;
    } catch (err) {
      console.warn('Resend failed, falling back to SMTP:', err.message || err);
    }
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured; skipping email send');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass }
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (err) {
    console.error('Nodemailer send failed', err);
    return false;
  }
};
