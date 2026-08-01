import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService.js";

/**
 * GET /api/notifications
 * Returns paginated notifications for current user.
 */
export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const data = await getUserNotifications(userId, page, limit);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read.
 */
export async function markRead(req, res, next) {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    if (notificationId === "read-all") {
      const resData = await markAllNotificationsRead(userId);
      return res.status(200).json(resData);
    }

    const resData = await markNotificationRead(userId, notificationId);
    return res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all user notifications as read.
 */
export async function markAllRead(req, res, next) {
  try {
    const userId = req.user.id;
    const resData = await markAllNotificationsRead(userId);
    return res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
}
