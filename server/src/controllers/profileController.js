import { supabaseAdmin } from "../config/supabase.js";
import { updateProfileSchema } from "../validators/profile.js";
import { getDemoUserByToken } from "../utils/demoAuth.js";

/**
 * GET /api/profile
 * Returns the current authenticated user's profile.
 */
export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // Check demo user fallback
    if (req.token) {
      const demoRecord = getDemoUserByToken(req.token);
      if (demoRecord) {
        return res.status(200).json({
          profile: demoRecord.profile,
        });
      }
    }

    let { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: {
          message: "Failed to fetch user profile",
          details: error.message,
        },
      });
    }

    // If profile row doesn't exist yet, create default row
    if (!profile) {
      const defaultData = {
        id: userId,
        full_name: req.user.user_metadata?.full_name || "",
        avatar_url: req.user.user_metadata?.avatar_url || "",
      };

      const { data: createdProfile, error: createError } = await supabaseAdmin
        .from("profiles")
        .insert(defaultData)
        .select("*")
        .single();

      if (createError) {
        return res.status(200).json({
          profile: defaultData,
        });
      }

      profile = createdProfile;
    }

    return res.status(200).json({
      profile,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile
 * Updates fields on the authenticated user's profile.
 */
export async function updateProfile(req, res, next) {
  try {
    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const userId = req.user.id;
    const updates = {
      ...result.data,
      updated_at: new Date().toISOString(),
    };

    // Check demo user fallback
    if (req.token) {
      const demoRecord = getDemoUserByToken(req.token);
      if (demoRecord) {
        Object.assign(demoRecord.profile, updates);
        return res.status(200).json({
          message: "Profile updated successfully",
          profile: demoRecord.profile,
        });
      }
    }

    const { data: updatedProfile, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select("*")
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: {
          message: "Failed to update profile",
          details: error.message,
        },
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile || { id: userId, ...updates },
    });
  } catch (err) {
    next(err);
  }
}
