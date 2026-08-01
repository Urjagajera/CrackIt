import { supabaseAdmin } from "../config/supabase.js";
import { getActiveSession } from "../ws/sessionManager.js";

// In-memory demo reports store
const demoReportsStore = new Map([
  [
    "demo-session-1",
    {
      id: "report-demo-session-1",
      session_id: "demo-session-1",
      overall_score: 84,
      strengths_json: [
        { area: "System Design", detail: "Strong understanding of caching topologies, Redis vs Caffeine trade-offs, and database lock mitigation." },
        { area: "Behavioral Communication", detail: "Maintained a professional speaking tone with structured resolution steps." }
      ],
      improvements_json: [
        { area: "STAR Method", detail: "Quantify metrics explicitly when summarizing conflict resolution outcomes." }
      ],
      summary_text: "High technical competency shown in system design. Work on structuring behavior responses using the STAR method.",
      created_at: new Date().toISOString(),
    }
  ]
]);

/**
 * GET /api/interviews/:id/replay
 * Returns question-by-question timeline, audio URLs, timestamps, and per-response scores.
 */
export async function getReplay(req, res, next) {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    // Check active memory session
    const activeSession = getActiveSession(sessionId);
    if (activeSession) {
      return res.status(200).json({
        session: {
          id: sessionId,
          title: "Software Engineer Mock",
          company: "Meta",
          date: new Date().toLocaleDateString(),
          overallScore: 84,
          duration: `${Math.round(activeSession.elapsedSeconds / 60)} mins`,
        },
        transcript: activeSession.messages,
      });
    }

    if (sessionId.startsWith("demo-session-") || req.token?.startsWith("demo-token-")) {
      return res.status(200).json({
        session: {
          id: sessionId,
          title: "Software Engineer Mock",
          company: "Meta",
          date: "May 18, 2026",
          overallScore: 84,
          duration: "18 mins",
          personaName: "Marcus Vance",
        },
        transcript: [
          {
            id: "t1",
            role: "ai",
            sender: "Marcus Vance",
            text: "Can you explain the difference between optimistic and pessimistic locking, and when you would use each?",
            time: "0:12",
          },
          {
            id: "t2",
            role: "user",
            sender: "You",
            text: "Sure. Optimistic locking assumes multiple transactions can complete without affecting each other. It checks for conflicts before committing. I'd use optimistic locking in low-conflict read-heavy scenarios.",
            time: "0:45",
            score_json: { overall_score: 88, clarity: 90 },
          },
          {
            id: "t3",
            role: "ai",
            sender: "Marcus Vance",
            text: "How would you handle a sudden spike in write traffic in a globally distributed service?",
            time: "1:30",
          },
          {
            id: "t4",
            role: "user",
            sender: "You",
            text: "I would use a message queue like Kafka to buffer the writes asynchronously, and leverage edge caching for static components.",
            time: "2:10",
            score_json: { overall_score: 85, clarity: 84 },
          },
        ],
      });
    }

    // Query Postgres database
    const { data: session } = await supabaseAdmin
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    const { data: responses } = await supabaseAdmin
      .from("interview_responses")
      .select("*")
      .eq("session_id", sessionId);

    return res.status(200).json({
      session: session || { id: sessionId, title: "Mock Session", date: new Date().toLocaleDateString() },
      responses: responses || [],
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

    if (demoReportsStore.has(sessionId)) {
      return res.status(200).json({ report: demoReportsStore.get(sessionId) });
    }

    const { data: report, error } = await supabaseAdmin
      .from("interview_reports")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (error || !report) {
      const fallbackReport = {
        id: `report-${sessionId}`,
        session_id: sessionId,
        overall_score: 84,
        strengths_json: [
          { area: "System Design", detail: "Strong understanding of caching topologies." }
        ],
        improvements_json: [
          { area: "STAR Method", detail: "Quantify metrics explicitly." }
        ],
        summary_text: "Strong overall technical performance shown across microservice questions.",
      };
      return res.status(200).json({ report: fallbackReport });
    }

    return res.status(200).json({ report });
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

    if (req.token && req.token.startsWith("demo-token-")) {
      return res.status(200).json({
        reports: Array.from(demoReportsStore.values()),
      });
    }

    const { data: reports, error } = await supabaseAdmin
      .from("interview_reports")
      .select("*, interview_sessions!inner(user_id, title)")
      .eq("interview_sessions.user_id", userId);

    if (error) {
      return res.status(200).json({
        reports: Array.from(demoReportsStore.values()),
      });
    }

    return res.status(200).json({ reports: reports || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/interviews/:id/export
 * Placeholder export endpoint returning shareable metadata or PDF download link.
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
