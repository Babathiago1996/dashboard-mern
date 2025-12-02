import Lead from '../models/Lead.js';
import { AsyncParser } from '@json2csv/node';
import { sendNotification } from '../utils/email.js';

export const createLead = async (req, res, next) => {
  try {
    const payload = req.body;
    const lead = await Lead.create(payload);

    // try best-effort notification, don't fail lead creation
    try {
      await sendNotification({
        subject:` New lead: ${lead.name || 'unknown'}`,
        text: `Lead details:\nName: ${lead.name}\nEmail: ${lead.email || '-'}\nPhone: ${lead.phone || '-'}\nMessage: ${lead.message || '-'}`,
        lead
      });
    } catch (e) {
      console.warn('Notification failed (non-fatal):', e?.message || e);
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
    const leads = await Lead.find().sort({ createdAt: -1 }).skip(skip).limit(l).lean();
    return res.json({ ok: true, results: leads });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCsv = async (req, res, next) => {
  try {
    const leads = await Lead.find().lean();
    if (!leads.length) return res.status(404).json({ ok: false, message: 'No leads to export' });

    // define fields and labels
    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Message', value: 'message' },
      { label: 'Source', value: 'source' },
      { label: 'CreatedAt', value: 'createdAt' }
    ];

    const parser = new NodeAsyncParser({ fields });
    const csv = await parser.parseAsync(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0,10)}.csv"`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
