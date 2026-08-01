import { Router } from "express";
import {
  uploadMiddleware,
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";
import { requireAuth } from "../middleware/auth.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.use(requireAuth);

router.post("/upload", aiRateLimiter, uploadMiddleware, uploadResume);
router.get("/", listResumes);
router.get("/:id", getResume);
router.delete("/:id", deleteResume);

export default router;
