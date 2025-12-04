import express from 'express';
import { createLead, listLeads, exportLeadsCsv } from '../controllers/leadController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.post('/', createLead);               // public submit
router.get('/', auth, listLeads);           // protected list
router.get('/export/csv', auth, exportLeadsCsv); // protected export
export default router;