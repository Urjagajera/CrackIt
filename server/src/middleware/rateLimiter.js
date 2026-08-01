import { rateLimit } from "express-rate-limit";

// Global API rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many requests from this IP, please try again after 15 minutes.",
    },
  },
});

// Strict rate limiter for AI Engine placeholder calls
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 AI engine calls per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "AI engine rate limit reached. Please wait before starting another analysis.",
    },
  },
});

// Strict rate limiter for Authentication attempts
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 auth requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many login/signup attempts. Please try again after 15 minutes.",
    },
  },
});
