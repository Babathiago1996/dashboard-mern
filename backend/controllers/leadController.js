import Lead from "../models/Lead.js";
import { exportToCsv } from "../utils/exportCsv.js";
import { sendNotification } from "../utils/email.js";
import emailQueue from "../queues/emailQueue.js";

export const createLead = async (req, res, next) => {
  try {
    const payload = req.body;
    const lead = await Lead.create(payload);

    // notify admin (best-effort)
    try {
      await sendNotification({
        to: process.env.ADMIN_EMAIL,
        subject: ` New lead: ${lead.name || "unknown"}`,
        html: `<p><strong>Name:</strong> ${lead.name}</p><p><strong>Email:</strong> ${lead.email}</p><p>${lead.message}</p>`,
        text: ` Name: ${lead.name}\nEmail: ${lead.email}\n${lead.message}`,
      });
    } catch (err) {
      console.warn("Admin notification failed (non-fatal)", err.message || err);
    }

    // enqueue autoresponder (5 minutes)
    try {
      await emailQueue.add(
        {
          to: lead.email,
          subject: "Thanks — we received your message",
          html: ` <p>Hi ${lead.name || "there"},</p><p>Thanks — we received your message. We'll get back to you soon.</p>`,
          text: ` Hi ${lead.name || ""},\n\nThanks — we received your message. We'll get back to you soon.`,
        },
        { delay: 1000 * 60 * 5, attempts: 3 }
      );
    } catch (err) {
      console.warn("Failed to enqueue autoresponder", err.message || err);
    }

    return res.status(201).json({ ok: true, id: lead._id });
  } catch (err) {
    next(err);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 200 } = req.query;
    const l = Math.min(Number(limit) || 200, 2000);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * l;
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();
    return res.json({ ok: true, results: leads });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCsv = async (req, res, next) => {
  try {
    const leads = await Lead.find().lean();
    if (!leads.length)
      return res.status(404).json({ ok: false, message: "No leads to export" });

    const fields = [
      { label: "ID", value: "_id" },
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Message", value: "message" },
      { label: "Source", value: "source" },
      { label: "CreatedAt", value: "createdAt" },
    ];

    const csv = await exportToCsv(leads, fields);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      ` attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
