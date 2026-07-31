import { z } from "zod";

export const createJobSchema = z
  .object({
    title: z.string().optional().default("Target Job Description"),
    company: z.string().optional().default("Target Company"),
    jd_text: z.string().optional(),
    jd_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
    location: z.string().optional(),
    salary_range: z.string().optional(),
  })
  .refine((data) => (data.jd_text && data.jd_text.trim().length > 0) || (data.jd_url && data.jd_url.trim().length > 0), {
    message: "Either jd_text or jd_url must be provided",
    path: ["jd_text"],
  });

export const jobMatchSchema = z.object({
  job_id: z.string().optional(),
  resume_id: z.string().optional(),
  jd_text: z.string().optional(),
});
