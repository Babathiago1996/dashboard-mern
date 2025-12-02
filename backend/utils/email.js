import nodemailer from "nodemailer";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@yourdomain.com";
const EMAIL_TO =
  process.env.EMAIL_TO || process.env.EMAIL_TO || "admin@yourdomain.com";

let resendClient;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

/**
 * sendNotification - tries Resend first; falls back to SMTP (nodemailer) if Resend not configured
 * @param {Object} opts { subject, text, html, lead }
 */
export const sendNotification = async (opts = {}) => {
  const { subject = "Notification", text = "", html = "" } = opts;

  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject,
        html: html || `<pre>${text}</pre>`,
      });
      return true;
    } catch (err) {
      console.warn(
        "Resend send failed, falling back to SMTP:",
        err?.message || err
      );
      // fall through to nodemailer
    }
  }

  // Nodemailer fallback
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP not configured; notification skipped");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465, // true for 465
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("Nodemailer send failed", err);
    return false;
  }
};
