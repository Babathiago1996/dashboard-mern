import express from 'express';
import { createLead, listLeads, exportLeadsCsv } from '../controllers/leadController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public lead submission
router.post('/', createLead);

// Protected list + export
router.get('/', auth, listLeads);
router.get('/export/csv', auth, exportLeadsCsv);

export default router;