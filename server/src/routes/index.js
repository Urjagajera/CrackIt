import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import resumeRouter from "./resume.js";
import jobsRouter from "./jobs.js";
import jobMatchRouter from "./jobMatch.js";
import projectsRouter from "./projects.js";
import interviewsRouter from "./interviews.js";
import analyticsRouter from "./analytics.js";
import settingsRouter from "./settings.js";
import notificationsRouter from "./notifications.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/resume", resumeRouter);
router.use("/jobs", jobsRouter);
router.use("/job-match", jobMatchRouter);
router.use("/projects", projectsRouter);
router.use("/analytics", analyticsRouter);
router.use("/settings", settingsRouter);
router.use("/notifications", notificationsRouter);
router.use("/", interviewsRouter);

export default router;






