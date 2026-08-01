import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  uploadVideoMiddleware,
  uploadSessionVideo,
} from "../controllers/videoController.js";

const router = Router();

/**
 * POST /api/interviews/:sessionId/video
 * Upload session recording video blob. Authenticated.
 * Accepts multipart/form-data with field name "video".
 */
router.post(
  "/interviews/:sessionId/video",
  requireAuth,
  uploadVideoMiddleware,
  uploadSessionVideo
);

export default router;
