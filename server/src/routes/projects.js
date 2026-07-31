import { Router } from "express";
import {
  listProjects,
  createProject,
  analyzeProjectEndpoint,
} from "../controllers/projectsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.post("/:id/analyze", analyzeProjectEndpoint);

export default router;
