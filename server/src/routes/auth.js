import { Router } from "express";
import {
  signup,
  login,
  logout,
  getMe,
  resetPassword,
  refreshSession,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.post("/reset-password", authRateLimiter, resetPassword);
router.post("/refresh", refreshSession);

export default router;
