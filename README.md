# you can access the frontend od this project : https://github.com/Siddu230/Financial-Assistant_frontend\

---
# To use the Apllication Default Login details  
 - Default mail : admin@gmail.com 
 - Default pass: admin
---

# Finance Assistant — Backend (Node + Express + MongoDB)

**Purpose:** REST API for the Finance Assistant. Handles:
- user authentication (signup/login) — JWT token
- transactions CRUD (create, list, delete)
- file uploads (receipts / bank statements) → parse OCR or text extraction → produce parsed transactions
- (optionally) serve the frontend build

This README explains how to:
- install & run locally
- set required environment variables
- deploy to Render
- basic API endpoints & sample requests
- troubleshoot common deployment errors

---

## Prerequisites

- Node.js (≥18 recommended) and npm
- MongoDB connection (local or hosted like MongoDB Atlas)
- Optional: `tesseract.js` and `pdf-parse` are used for OCR / PDF parsing

---

## Project layout (important files)

backend/

├─ package.json

├─ server.js # main server (you provided)

├─ routes/

│ ├─ auth.js

│ ├─ transactions.js

│ └─ upload.js

├─ models/

│ ├─ User.js

│ └─ Transaction.js

└─ .env

---

## Environment variables

Create a `.env` file in the **backend** root (next to package.json and server.js).

Example `.env`:

PORT=5000 

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret_here

ALLOW_ALL_CORS=true

SERVE_FRONTEND=false

--- 

**Important**
- `MONGODB_URI` must be set — the server will exit if it is missing.
- For production, set `ALLOW_ALL_CORS=false` and configure `ALLOWED_ORIGINS` instead (comma-separated).
- Keep `JWT_SECRET` secret.

---
## Server listens on PORT (default 5000).
- if after deploying you can chnage the default port.
---
## Install & run locally

```bash
# from backend/ directory
npm install

# development (auto-restart)
npm run dev

# production
npm start

```
---

# Security & production notes

- Use a real JWT_SECRET and keep it secret.

- Use HTTPS for all deployed endpoints.

- Limit CORS to trusted origins in production.

- For file uploads consider scanning and validating file types, and store files in S3 or other cloud storage rather than local disk if you run multiple backend instances.
