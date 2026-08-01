import { Router } from "express";
import {
  listProjects,
  createProject,
  analyzeProjectEndpoint,
} from "../controllers/projectsController.js";
import { requireAuth } from "../middleware/auth.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.post("/:id/analyze", aiRateLimiter, analyzeProjectEndpoint);

export default router;
