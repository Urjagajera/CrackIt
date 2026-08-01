import { getAnalyticsSchema } from "../validators/analytics.js";
import { calculateAnalytics } from "../services/analyticsService.js";

/**
 * GET /api/analytics?period=week|month|all
 * Returns aggregated analytics, placement readiness trends, skill breakdown, and topic mastery.
 */
export async function getAnalytics(req, res, next) {
  try {
    const result = getAnalyticsSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Invalid query parameters",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const { period } = result.data;
    const userId = req.user.id;

    const analyticsData = await calculateAnalytics(userId, period);

    return res.status(200).json(analyticsData);
  } catch (err) {
    next(err);
  }
}
