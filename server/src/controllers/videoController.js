import { supabaseAdmin } from "../config/supabase.js";
import multer from "multer";
import {
  getCompletedSession,
  setSessionVideoUrl,
} from "../ws/sessionManager.js";

// Use memory storage — stream directly to Supabase Storage
const storage = multer.memoryStorage();

export const uploadVideoMiddleware = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["video/webm", "video/mp4", "video/ogg", "application/octet-stream"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported video format: ${file.mimetype}`), false);
    }
  },
}).single("video");

/**
 * POST /api/interviews/:sessionId/video
 *
 * Accepts a multipart video blob recorded by MediaRecorder in the browser.
 * Uploads to Supabase Storage → interview-videos/<userId>/<sessionId>.webm
 * Saves the signed URL to interview_sessions.video_url (DB) and in-memory
 * session store so GET /api/interviews/:id/replay can return it immediately.
 */
export async function uploadSessionVideo(req, res, next) {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id || "demo-user-urja-12345";

    if (!req.file) {
      return res.status(400).json({ error: { message: "No video file received." } });
    }

    const ext = req.file.mimetype === "video/mp4" ? "mp4" : "webm";
    const storagePath = `${userId}/${sessionId}.${ext}`;

    // Upload buffer to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("interview-videos")
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      // Log but don't crash — video upload failure is non-fatal
      console.error("❌ [Video Upload] Supabase Storage error:", uploadError.message);
    }

    // Generate a signed URL valid for 7 days (604800 seconds)
    let videoUrl = null;
    if (!uploadError) {
      const { data: signedData } = await supabaseAdmin.storage
        .from("interview-videos")
        .createSignedUrl(storagePath, 604800);
      videoUrl = signedData?.signedUrl || null;
    }

    // Persist to DB if real session (not demo)
    if (!sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
      await supabaseAdmin
        .from("interview_sessions")
        .update({ video_url: videoUrl })
        .eq("id", sessionId)
        .catch(() => {});
    }

    // Update in-memory completed session store immediately
    if (videoUrl) {
      setSessionVideoUrl(sessionId, videoUrl);
      console.log(`🎬 [Video Upload] Session ${sessionId} video stored: ${storagePath}`);
    }

    return res.status(200).json({
      message: "Video uploaded successfully.",
      video_url: videoUrl,
      path: storagePath,
    });
  } catch (err) {
    next(err);
  }
}
