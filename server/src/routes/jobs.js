import { Router } from "express";
import { createJob, listJobs } from "../controllers/jobsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/", createJob);
router.get("/", listJobs);

export default router;
