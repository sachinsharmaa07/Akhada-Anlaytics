const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Extract JWT from Authorization header OR httpOnly cookie
 */
const extractToken = (req) => {
  // 1. Bearer token (backwards-compatible)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  // 2. Cookie-based token
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }
  return null;
};

/**
 * Core auth guard — verifies JWT, attaches req.user
 */
const protect = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, authProvider, onboardingStatus }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

/**
 * Onboarding enforcement — blocks access until profile is complete.
 * Use AFTER protect middleware on routes that need a fully onboarded user.
 */
const requireOnboarded = (req, res, next) => {
  if (req.user.onboardingStatus === 'INCOMPLETE') {
    return res.status(403).json({
      message: 'Onboarding incomplete',
      code: 'ONBOARDING_REQUIRED',
      onboardingStatus: 'INCOMPLETE',
    });
  }
  next();
};

module.exports = { protect, requireOnboarded, extractToken };
