import { Router } from "express";
import {
  getReplay,
  getReport,
  listReports,
  exportReport,
} from "../controllers/interviewsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/reports", listReports);
router.get("/interviews/:id/replay", getReplay);
router.get("/interviews/:id/report", getReport);
router.post("/interviews/:id/export", exportReport);

export default router;
