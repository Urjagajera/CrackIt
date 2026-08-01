import { z } from "zod";

/**
 * Validates and exports all required environment variables.
 * Throws at startup if anything is missing — fail fast, fail loud.
 */
const envSchema = z.object({
  SUPABASE_URL: z
    .string()
    .url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY: z
    .string()
    .min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  PORT: z
    .string()
    .default("4000")
    .transform(Number)
    .pipe(z.number().int().positive()),
  // 'staging' is a valid runtime environment
  NODE_ENV: z
    .enum(["development", "production", "test", "staging"])
    .default("development"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173"),
  // Optional — used by auth flows that need server-side JWT signing (not Supabase sessions)
  JWT_SECRET: z
    .string()
    .optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
