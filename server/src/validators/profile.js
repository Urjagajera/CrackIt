import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, "Full name cannot be empty").optional(),
  target_role: z.string().nullable().optional(),
  experience_level: z
    .enum(["student", "entry", "junior", "mid", "senior", "lead", "principal"])
    .nullable()
    .optional(),
  career_stage: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  linkedin_url: z
    .string()
    .url("LinkedIn URL must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  avatar_url: z
    .string()
    .url("Avatar URL must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
});
