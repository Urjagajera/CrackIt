import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import resumeRouter from "./resume.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/resume", resumeRouter);

export default router;


