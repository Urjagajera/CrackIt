import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fullName: z.string().optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  redirectTo: z.string().url("Invalid redirect URL").optional(),
});

export const refreshSessionSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
