import { supabaseAdmin } from "../config/supabase.js";

const DEFAULT_SETTINGS = {
  practice_reminders: true,
  analytical_reports: true,
  marketing_tips: false,
  default_difficulty: "Mid/Senior",
  voice_audio_enabled: true,
  camera_preview_enabled: false,
};

// Memory fallback store for demo mode
const memorySettingsStore = new Map();

export async function getUserSettings(userId) {
  if (memorySettingsStore.has(userId)) {
    return memorySettingsStore.get(userId);
  }

  try {
    if (!userId.startsWith("demo-user-")) {
      const { data, error } = await supabaseAdmin
        .from("user_settings")
        .select("preferences_json")
        .eq("user_id", userId)
        .maybeSingle();

      if (data?.preferences_json) {
        const merged = { ...DEFAULT_SETTINGS, ...data.preferences_json };
        memorySettingsStore.set(userId, merged);
        return merged;
      }
    }
  } catch {
    // Fallback
  }

  const initial = { ...DEFAULT_SETTINGS };
  memorySettingsStore.set(userId, initial);
  return initial;
}

export async function updateUserSettings(userId, newPreferences) {
  const current = await getUserSettings(userId);
  const updated = { ...current, ...newPreferences };

  memorySettingsStore.set(userId, updated);

  try {
    if (!userId.startsWith("demo-user-")) {
      await supabaseAdmin.from("user_settings").upsert(
        {
          user_id: userId,
          preferences_json: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  } catch (err) {
    console.error("Failed to update user_settings in Supabase:", err);
  }

  return updated;
}
