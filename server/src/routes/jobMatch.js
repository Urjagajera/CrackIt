import { Router } from "express";
import { createMatch, getMatch } from "../controllers/jobMatchController.js";
import { requireAuth } from "../middleware/auth.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.use(requireAuth);

router.post("/", aiRateLimiter, createMatch);
router.get("/:id", getMatch);

export default router;
