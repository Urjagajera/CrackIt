import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional().default(""),
  tech_stack: z.array(z.string()).optional().default([]),
  source_url: z.string().url("Invalid URL format").or(z.literal("")).optional().default(""),
});
