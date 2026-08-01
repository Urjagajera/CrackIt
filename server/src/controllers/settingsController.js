import { updateSettingsSchema } from "../validators/settings.js";
import { getUserSettings, updateUserSettings } from "../services/settingsService.js";

/**
 * GET /api/settings
 * Reads current user preferences.
 */
export async function getSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const settings = await getUserSettings(userId);
    return res.status(200).json({ settings });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/settings
 * Writes/updates user preferences.
 */
export async function updateSettings(req, res, next) {
  try {
    const result = updateSettingsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const userId = req.user.id;
    const updated = await updateUserSettings(userId, result.data);

    return res.status(200).json({
      message: "Settings updated successfully",
      settings: updated,
    });
  } catch (err) {
    next(err);
  }
}
