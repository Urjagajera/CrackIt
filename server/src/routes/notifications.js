import { Router } from "express";
import {
  getNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);

export default router;
