// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ALLOW_ALL_CORS = (process.env.ALLOW_ALL_CORS === 'true');

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Exiting.');
  process.exit(1);
}

// --- DB connect ---
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});

// --- Middleware ---
app.use(express.json({ limit: '10mb' })); // allow JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


if (ALLOW_ALL_CORS) {
  app.use(cors());
  console.log('CORS: allow all origins (ALLOW_ALL_CORS=true)');
} else {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server/curl
      if (allowedOrigins.length === 0) return callback(null, true); // no origins set -> allow for now
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      callback(new Error('CORS not allowed'));
    },
    credentials: true
  }));
  console.log('CORS configured. Allowed origins:', allowedOrigins);
}

// --- Basic routes (health) ---
app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// --- Mount your routes ---
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/transactions', require('./routes/transactions'));
  app.use('/api/upload', require('./routes/upload'));
} catch (err) {
  console.warn('Route files not found - ensure ./routes/auth, ./routes/transactions, ./routes/upload exist.', err.message);
}

// 
if (process.env.SERVE_FRONTEND === 'true') {
  const buildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

// --- Error handler (simple) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.message ? err.message : err);
  res.status(500).json({ message: err?.message || 'Server error' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
});
