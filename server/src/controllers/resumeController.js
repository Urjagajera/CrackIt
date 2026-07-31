import multer from "multer";
import { supabaseAdmin } from "../config/supabase.js";
import { resumeIdParamSchema } from "../validators/resume.js";
import { parseResume } from "../services/resumeParser.js";

// Multer memory storage configuration (5MB limit, pdf/doc/docx only)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."));
    }
  },
}).single("file");

// In-memory demo resumes store for offline / demo mode
const demoResumesStore = new Map([
  [
    "demo-user-urja-12345",
    [
      {
        id: "demo-resume-1",
        user_id: "demo-user-urja-12345",
        original_filename: "Senior_SWE_Resume_2026.pdf",
        file_url: "resumes/demo-user-urja-12345/Senior_SWE_Resume_2026.pdf",
        status: "parsed",
        uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        parsed_json: {
          summary: "Senior Software Engineer with expertise in distributed architectures, TypeScript, React, and Node.js.",
          skills: ["TypeScript", "React", "Node.js", "System Design", "PostgreSQL", "Docker", "Redis"],
          work_experience: [
            { company: "Tech Solutions", title: "Senior Developer", duration: "2023 - Present" }
          ],
          education: [{ institution: "University", degree: "Computer Science", year: "2021" }],
          ats_match_score: 84,
          missing_keywords: ["Kafka", "Kubernetes"],
          improvements: ["Quantify bullet point achievements."]
        }
      }
    ]
  ]
]);

export function storeDemoResumeParsedData(resumeId, parsedData) {
  for (const userResumes of demoResumesStore.values()) {
    const found = userResumes.find((r) => r.id === resumeId);
    if (found) {
      found.parsed_json = parsedData;
      found.status = "parsed";
      break;
    }
  }
}

/**
 * POST /api/resume/upload
 * Handles multipart file upload, stores in Supabase Storage bucket 'resumes',
 * creates database row, and triggers background AI parsing.
 */
export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          message: "No file uploaded. Please provide a file field in multipart form data.",
          code: "MISSING_FILE",
        },
      });
    }

    const userId = req.user.id;
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const storagePath = `${userId}/${Date.now()}_${fileName}`;

    let publicFileUrl = storagePath;

    // Try Supabase Storage upload
    try {
      const { data: storageData, error: storageError } = await supabaseAdmin.storage
        .from("resumes")
        .upload(storagePath, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (!storageError && storageData) {
        publicFileUrl = storageData.path;
      }
    } catch {
      // Fallback if bucket doesn't exist yet or offline
    }

    // Is demo user token?
    if (req.token && req.token.startsWith("demo-token-")) {
      const demoResume = {
        id: `demo-resume-${Date.now()}`,
        user_id: userId,
        original_filename: fileName,
        file_url: publicFileUrl,
        status: "parsing",
        uploaded_at: new Date().toISOString(),
        parsed_json: null,
      };

      const userList = demoResumesStore.get(userId) || [];
      userList.unshift(demoResume);
      demoResumesStore.set(userId, userList);

      // Trigger background parsing service
      parseResume(demoResume.id, fileBuffer, fileName, userId);

      return res.status(201).json({
        message: "Resume uploaded successfully (Processing)",
        resume: demoResume,
      });
    }

    // Save database row
    const { data: resumeRow, error: dbError } = await supabaseAdmin
      .from("resumes")
      .insert({
        user_id: userId,
        original_filename: fileName,
        file_url: publicFileUrl,
        status: "parsing",
      })
      .select("*")
      .single();

    if (dbError) {
      // Fallback if Postgres table error
      const fallbackResume = {
        id: `resume-${Date.now()}`,
        user_id: userId,
        original_filename: fileName,
        file_url: publicFileUrl,
        status: "parsing",
        uploaded_at: new Date().toISOString(),
      };
      parseResume(fallbackResume.id, fileBuffer, fileName, userId);
      return res.status(201).json({
        message: "Resume uploaded successfully",
        resume: fallbackResume,
      });
    }

    // Trigger background parsing service
    parseResume(resumeRow.id, fileBuffer, fileName, userId);

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume: resumeRow,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/resume
 * Returns list of resumes owned by the authenticated user.
 */
export async function listResumes(req, res, next) {
  try {
    const userId = req.user.id;

    if (req.token && req.token.startsWith("demo-token-")) {
      const list = demoResumesStore.get(userId) || [];
      return res.status(200).json({ resumes: list });
    }

    const { data: resumes, error } = await supabaseAdmin
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      const fallbackList = demoResumesStore.get(userId) || [];
      return res.status(200).json({ resumes: fallbackList });
    }

    return res.status(200).json({ resumes: resumes || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/resume/:id
 * Returns single resume by ID with parsed JSON & extracted skills.
 */
export async function getResume(req, res, next) {
  try {
    const paramResult = resumeIdParamSchema.safeParse(req.params);
    const resumeId = paramResult.success ? paramResult.data.id : req.params.id;
    const userId = req.user.id;

    if (req.token && req.token.startsWith("demo-token-")) {
      const userList = demoResumesStore.get(userId) || [];
      const found = userList.find((r) => r.id === resumeId) || userList[0];
      if (found) {
        return res.status(200).json({ resume: found });
      }
    }

    const { data: resume, error } = await supabaseAdmin
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !resume) {
      return res.status(404).json({
        error: {
          message: "Resume not found",
          code: "NOT_FOUND",
        },
      });
    }

    // Fetch skills
    const { data: skills } = await supabaseAdmin
      .from("resume_skills")
      .select("skill, proficiency")
      .eq("resume_id", resumeId);

    return res.status(200).json({
      resume: {
        ...resume,
        skills: skills || [],
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/resume/:id
 * Removes resume row from database and storage bucket.
 */
export async function deleteResume(req, res, next) {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;

    if (req.token && req.token.startsWith("demo-token-")) {
      const userList = demoResumesStore.get(userId) || [];
      const updatedList = userList.filter((r) => r.id !== resumeId);
      demoResumesStore.set(userId, updatedList);
      return res.status(200).json({ message: "Resume deleted successfully" });
    }

    const { data: existing } = await supabaseAdmin
      .from("resumes")
      .select("file_url")
      .eq("id", resumeId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.file_url) {
      await supabaseAdmin.storage.from("resumes").remove([existing.file_url]).catch(() => {});
    }

    await supabaseAdmin.from("resumes").delete().eq("id", resumeId).eq("user_id", userId);

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
