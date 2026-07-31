import { Router } from "express";
import { createMatch, getMatch } from "../controllers/jobMatchController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/", createMatch);
router.get("/:id", getMatch);

export default router;
