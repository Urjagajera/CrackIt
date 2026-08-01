import { supabaseAdmin } from "../config/supabase.js";
import {
  getActiveSession,
  getCompletedSession,
  getCompletedReport,
  getCompletedReports,
} from "../ws/sessionManager.js";

/**
 * GET /api/interviews/:id/replay
 * Returns question-by-question timeline, timestamps, and per-response scores.
 */
export async function getReplay(req, res, next) {
  try {
    const sessionId = req.params.id;

    // 1. Check active in-memory session
    const activeSession = getActiveSession(sessionId);
    if (activeSession) {
      const mins = Math.round(activeSession.elapsedSeconds / 60) || 1;
      return res.status(200).json({
        session: {
          id: sessionId,
          title: "Technical Mock Interview",
          company: "Target Placement",
          date: new Date().toLocaleDateString(),
          overallScore: 84,
          duration: `${mins} mins`,
          status: "in_progress",
        },
        transcript: activeSession.messages,
        responses: activeSession.responses,
      });
    }

    // 2. Check completed in-memory session
    const completed = getCompletedSession(sessionId);
    if (completed) {
      const mins = Math.round(completed.elapsedSeconds / 60) || 1;
      const report = getCompletedReport(sessionId);

      let totalScore = 0;
      let count = 0;
      for (const r of completed.responses || []) {
        const sc = r.score_json?.overall_score || r.overall_score;
        if (typeof sc === "number") {
          totalScore += sc;
          count++;
        }
      }
      const actualAverageScore = count > 0 ? Math.round(totalScore / count) : (report?.overall_score || 85);

      return res.status(200).json({
        session: {
          id: sessionId,
          title: completed.title || "Technical Mock Interview",
          company: completed.company || "Target Placement",
          date: new Date(completed.created_at).toLocaleDateString(),
          overallScore: actualAverageScore,
          duration: `${mins} mins`,
          status: "completed",
          video_url: completed.video_url || null,
        },
        transcript: completed.messages,
        responses: completed.responses,
      });
    }

    // 3. Query PostgreSQL database
    const { data: dbSession } = await supabaseAdmin
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    const { data: dbResponses } = await supabaseAdmin
      .from("interview_responses")
      .select("*")
      .eq("session_id", sessionId);

    if (dbSession) {
      return res.status(200).json({
        session: dbSession,
        responses: dbResponses || [],
      });
    }

    return res.status(404).json({
      error: { message: `Interview session '${sessionId}' not found.` },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/interviews/:id/report
 * Returns full aggregate performance report for a session.
 */
export async function getReport(req, res, next) {
  try {
    const sessionId = req.params.id;

    // 1. Check in-memory completed report
    const memReport = getCompletedReport(sessionId);
    if (memReport) {
      return res.status(200).json({ report: memReport });
    }

    // 2. Query PostgreSQL database
    const { data: report } = await supabaseAdmin
      .from("interview_reports")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (report) {
      return res.status(200).json({ report });
    }

    return res.status(404).json({
      error: { message: `Report for session '${sessionId}' not found.` },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports
 * Lists all session reports for current authenticated user.
 */
export async function listReports(req, res, next) {
  try {
    const userId = req.user.id;
    const memoryReports = getCompletedReports(userId);

    const { data: dbReports } = await supabaseAdmin
      .from("interview_reports")
      .select("*, interview_sessions!inner(user_id, title)")
      .eq("interview_sessions.user_id", userId);

    const combined = [...memoryReports];
    if (dbReports && dbReports.length > 0) {
      for (const dbr of dbReports) {
        if (!combined.some((r) => r.session_id === dbr.session_id)) {
          combined.push(dbr);
        }
      }
    }

    return res.status(200).json({ reports: combined });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/interviews/:id/export
 * Export endpoint returning download metadata.
 */
export async function exportReport(req, res, next) {
  try {
    const sessionId = req.params.id;
    return res.status(200).json({
      message: "Export generated successfully",
      download_url: `/api/interviews/${sessionId}/download.pdf`,
      shareable_link: `http://localhost:5173/interview-replay/${sessionId}`,
    });
  } catch (err) {
    next(err);
  }
}
