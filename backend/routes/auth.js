const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  next();
};

/** Build JWT access token (short-lived — 15 min) */
const createAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      authProvider: user.authProvider,
      onboardingStatus: user.onboardingStatus,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

/** Create & persist a refresh token (long-lived — 30 days) */
const createRefreshToken = async (user) => {
  const token = crypto.randomBytes(64).toString('hex');
  await RefreshToken.create({
    userId: user._id,
    token,
    authProvider: user.authProvider,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return token;
};

/** Set httpOnly cookies on the response */
const setCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',   // 'none' required for cross-domain (Vercel ↔ Render)
    path: '/',
  };
  res.cookie('access_token', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge: 30 * 24 * 60 * 60 * 1000 });
};

/** Strip password from user doc and return safe DTO */
const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  username: u.username,
  gender: u.gender,
  age: u.age,
  weight: u.weight,
  height: u.height,
  activityLevel: u.activityLevel,
  dailyGoal: u.dailyGoal,
  authProvider: u.authProvider,
  onboardingStatus: u.onboardingStatus,
  avatar: u.avatar,
});

/* ═══════════════════════════════════════════════════════
   POST /register   — local email/password registration
   ═══════════════════════════════════════════════════════ */
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
], async (req, res) => {
  try {
    const { name, email, password, gender, age, weight, height, activityLevel } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashed, gender, age, weight, height, activityLevel,
      authProvider: 'local',
      onboardingStatus: 'COMPLETE', // local signup collects everything upfront
    });

    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    // Also return Bearer-style token for backwards compatibility
    const legacyToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    setCookies(res, accessToken, refreshToken);
    res.status(201).json({ token: legacyToken, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /login   — local email/password login
   ═══════════════════════════════════════════════════════ */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // If user signed up via Google, prevent local login
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ message: 'This account uses Google Sign-In. Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    const legacyToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ token: legacyToken, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /google   — Google OAuth (receives ID token from frontend)
   ═══════════════════════════════════════════════════════ */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token from frontend
    if (!credential) return res.status(400).json({ message: 'Missing Google credential' });

    // Verify the Google ID token using Google's tokeninfo endpoint
    // (no extra library needed — just a fetch call)
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    if (!verifyRes.ok) return res.status(401).json({ message: 'Invalid Google token' });

    const payload = await verifyRes.json();

    // Validate audience matches our client ID
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Token audience mismatch' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // ── Find or create user ──────────────────────────
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
      isDeleted: { $ne: true },
    });

    let isNewUser = false;

    if (!user) {
      // First time — create partial account
      isNewUser = true;
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        authProvider: 'google',
        onboardingStatus: 'INCOMPLETE',
      });
    } else if (!user.googleId) {
      // Existing local user logging in with Google → link accounts
      user.googleId = googleId;
      user.authProvider = 'google';
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    const legacyToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
      token: legacyToken,
      user: safeUser(user),
      isNewUser,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /onboarding   — Complete onboarding for new users
   ═══════════════════════════════════════════════════════ */
router.post('/onboarding', protect, [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  validate,
], async (req, res) => {
  try {
    const { username, gender, age, weight, height, activityLevel, dailyGoal } = req.body;

    // Check username uniqueness
    const existingUsername = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.user.id } });
    if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: username.toLowerCase(),
          gender: gender || 'male',
          age: age ? Number(age) : undefined,
          weight: weight ? Number(weight) : undefined,
          height: height ? Number(height) : undefined,
          activityLevel: activityLevel || 'moderate',
          dailyGoal: dailyGoal || { calories: 2200, protein: 160, carbs: 250, fats: 70 },
          onboardingStatus: 'COMPLETE',
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Issue fresh tokens with updated onboardingStatus
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    const legacyToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ token: legacyToken, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /refresh   — Rotate refresh token
   ═══════════════════════════════════════════════════════ */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const stored = await RefreshToken.findOne({ token });
    if (!stored || !stored.isActive()) {
      // Possible token reuse attack — revoke entire family
      if (stored) {
        await RefreshToken.updateMany({ userId: stored.userId }, { $set: { revokedAt: new Date() } });
      }
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(stored.userId).select('-password');
    if (!user || user.isDeleted) return res.status(401).json({ message: 'User not found' });

    // Rotate: revoke old, create new
    stored.revokedAt = new Date();
    const newRefreshToken = await createRefreshToken(user);
    stored.replacedByToken = newRefreshToken;
    await stored.save();

    const accessToken = createAccessToken(user);
    const legacyToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    setCookies(res, accessToken, newRefreshToken);
    res.status(200).json({ token: legacyToken, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /logout   — Revoke session + clear cookies
   ═══════════════════════════════════════════════════════ */
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate({ token: refreshToken }, { $set: { revokedAt: new Date() } });
    }
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   GET /check-username/:username   — Username availability
   ═══════════════════════════════════════════════════════ */
router.get('/check-username/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    if (username.length < 3) return res.json({ available: false });
    const exists = await User.findOne({ username });
    res.json({ available: !exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
