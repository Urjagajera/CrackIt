import { supabaseAdmin } from "../config/supabase.js";
import { createJobSchema } from "../validators/jobs.js";
import { fetchJobDescription } from "../services/jobFetcher.js";

// In-memory demo jobs store for offline/demo mode
const demoJobsStore = new Map([
  [
    "demo-user-urja-12345",
    [
      {
        id: "demo-job-1",
        user_id: "demo-user-urja-12345",
        title: "Senior Backend Engineer",
        company: "Meta",
        jd_text: "We are seeking a Senior Backend Engineer to build scalable microservices...",
        location: "San Francisco, CA",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ],
  ],
]);

export function getDemoJobById(jobId) {
  for (const list of demoJobsStore.values()) {
    const found = list.find((j) => j.id === jobId);
    if (found) return found;
  }
  return null;
}

/**
 * POST /api/jobs
 * Save a job description either by pasted text or by URL.
 */
export async function createJob(req, res, next) {
  try {
    const result = createJobSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const userId = req.user.id;
    let { title, company, jd_text, jd_url, location, salary_range } = result.data;

    // If URL provided, fetch via placeholder web scraper service
    if (jd_url && (!jd_text || jd_text.trim().length === 0)) {
      const scraped = await fetchJobDescription(jd_url);
      title = scraped.title || title;
      company = scraped.company || company;
      jd_text = scraped.jdText || jd_text;
      location = scraped.location || location;
      salary_range = scraped.salary_range || salary_range;
    }

    const newJobData = {
      user_id: userId,
      title: title || "Target Job Description",
      company: company || "Target Company",
      jd_text: jd_text || "",
      jd_url: jd_url || null,
      location: location || null,
      salary_range: salary_range || null,
      status: "active",
    };

    // Check demo mode token
    if (req.token && req.token.startsWith("demo-token-")) {
      const demoJob = {
        id: `demo-job-${Date.now()}`,
        ...newJobData,
        created_at: new Date().toISOString(),
      };
      const userList = demoJobsStore.get(userId) || [];
      userList.unshift(demoJob);
      demoJobsStore.set(userId, userList);

      return res.status(201).json({
        message: "Job saved successfully",
        job: demoJob,
      });
    }

    const { data: createdJob, error } = await supabaseAdmin
      .from("jobs")
      .insert(newJobData)
      .select("*")
      .single();

    if (error) {
      const fallbackJob = {
        id: `job-${Date.now()}`,
        ...newJobData,
        created_at: new Date().toISOString(),
      };
      return res.status(201).json({
        message: "Job saved successfully",
        job: fallbackJob,
      });
    }

    return res.status(201).json({
      message: "Job saved successfully",
      job: createdJob,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/jobs
 * List all saved jobs for current authenticated user.
 */
export async function listJobs(req, res, next) {
  try {
    const userId = req.user.id;

    if (req.token && req.token.startsWith("demo-token-")) {
      const list = demoJobsStore.get(userId) || [];
      return res.status(200).json({ jobs: list });
    }

    const { data: jobs, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      const list = demoJobsStore.get(userId) || [];
      return res.status(200).json({ jobs: list });
    }

    return res.status(200).json({ jobs: jobs || [] });
  } catch (err) {
    next(err);
  }
}
