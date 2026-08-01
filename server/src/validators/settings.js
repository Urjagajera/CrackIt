import { z } from "zod";

export const updateSettingsSchema = z.object({
  practice_reminders: z.boolean().optional(),
  analytical_reports: z.boolean().optional(),
  marketing_tips: z.boolean().optional(),
  default_difficulty: z.string().optional(),
  voice_audio_enabled: z.boolean().optional(),
  camera_preview_enabled: z.boolean().optional(),
});
