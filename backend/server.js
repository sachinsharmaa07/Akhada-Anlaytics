const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// --- Performance & security middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: function (origin, callback) {
    const allowed = (process.env.CLIENT_URL || 'http://localhost:3000')
      .split(',')
      .map(s => s.trim());
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Disable x-powered-by header
app.disable('x-powered-by');

// --- MongoDB connection with optimised pool ---
mongoose.set('strictQuery', true);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

// --- Routes ---
const rateLimit = require('express-rate-limit');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const workoutRouter = require('./routes/workout');
const nutritionRouter = require('./routes/nutrition');
const foodRouter = require('./routes/food');

// Rate-limit auth routes: 15 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again after 15 minutes' }
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/user', userRouter);
app.use('/api/workout', workoutRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/food', foodRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
