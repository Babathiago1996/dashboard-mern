# LeadManager — MERN Admin Dashboard (Revamped)

A production-ready MERN project: admin dashboard + landing site, responsive UI, email notifications, background queue, CSV export, JWT auth.

---

## Highlights

- Node 18+, Express, MongoDB (Mongoose)
- React 18 + Vite, Tailwind
- JWT authentication
- CSV export using @json2csv/node
- Email sending via Resend (preferred) with SMTP fallback
- Bull + Redis for delayed autoresponder (5 minutes)
- Responsive dashboard layout + mobile menu
- React Hook Form validation for login

---

## Local development

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Redis (for background queue; optional if you don't use autoresponder)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with MONGO_URI, JWT_SECRET, RESEND_API_KEY or SMTP credentials, REDIS_URL
npm install
npm run seed        # create admin from env variables
npm run dev
# In another terminal:
node worker.js      # start worker to process email queue
