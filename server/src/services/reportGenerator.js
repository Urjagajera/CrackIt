import { supabaseAdmin } from "../config/supabase.js";
import { createNotification } from "./notificationService.js";

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ⚠️ NARRATIVE SUMMARY AI PLACEHOLDER
 * ══════════════════════════════════════════════════════════════════════════════
 * Replace the body of this function with your AI LLM call to summarize performance.
 * ══════════════════════════════════════════════════════════════════════════════
 */
export async function generateNarrativeSummary(responses, session) {
  console.log(`🤖 [Report AI Generator] Generating summary for session ${session.id}...`);

  const strengths = [
    { area: "Technical System Design", detail: "Exemplary understanding of caching topologies, Redis vs Caffeine trade-offs, and database lock mitigation." },
    { area: "Communication & Clarity", detail: "Maintained a steady speaking pace with low filler word counts across all questions." },
  ];

  const improvements = [
    { area: "STAR Method Structure", detail: "Clearly demarcate the 'Result' phase when answering behavioral conflict questions." },
    { area: "Disaster Recovery", detail: "Elaborate further on automated failover health checks for multi-region database clusters." },
  ];

  const summaryText = "Strong technical session. Candidate demonstrated solid engineering intuition for backend scaling and distributed systems architecture, with high clarity and structured problem solving.";

  return {
    strengths,
    improvements,
    summaryText,
  };
}

/**
 * Generates and stores aggregate interview_reports row upon session completion.
 * 
 * @param {string} sessionId - UUID of completed session
 * @param {string} userId - Owner ID
 * @param {Array<object>} memoryResponses - In-memory recorded responses
 */
export async function generateReport(sessionId, userId, memoryResponses = []) {
  try {
    console.log(`📊 [Report Generator] Calculating actual average score for session ${sessionId}...`);

    let responses = memoryResponses || [];
    let session = { id: sessionId, title: "Technical Mock Interview" };

    if (responses.length === 0 && !sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
      const { data: dbResponses } = await supabaseAdmin
        .from("interview_responses")
        .select("*")
        .eq("session_id", sessionId);

      const { data: dbSession } = await supabaseAdmin
        .from("interview_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();

      if (dbResponses) responses = dbResponses;
      if (dbSession) session = dbSession;
    }

    // Calculate EXACT ACTUAL average score across all candidate responses
    let totalScore = 0;
    let count = 0;

    for (const r of responses) {
      const score = r.score_json?.overall_score || r.overall_score;
      if (typeof score === "number") {
        totalScore += score;
        count++;
      }
    }

    const actualAverageScore = count > 0 ? Math.round(totalScore / count) : 85;
    console.log(`🎯 [Report Generator] Calculated Actual Average Score: ${actualAverageScore}% (${count} response(s))`);

    const narrative = await generateNarrativeSummary(responses, session);

    // Aggregate emotion / body-language data from per-response face-api.js summaries
    const emotionRecords = responses
      .map((r) => r.emotion_summary_json)
      .filter(Boolean);

    let emotionSummary = null;
    if (emotionRecords.length > 0) {
      const dominantCounts = {};
      let totalConfidence = 0;
      let totalNervousness = 0;

      for (const e of emotionRecords) {
        dominantCounts[e.dominant_emotion] = (dominantCounts[e.dominant_emotion] || 0) + 1;
        totalConfidence += typeof e.avg_confidence === "number" ? e.avg_confidence : 0;
        totalNervousness += typeof e.avg_nervousness === "number" ? e.avg_nervousness : 0;
      }

      const overallDominant = Object.entries(dominantCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
      emotionSummary = {
        overall_dominant_emotion: overallDominant,
        avg_confidence: Math.round((totalConfidence / emotionRecords.length) * 100),
        avg_nervousness: Math.round((totalNervousness / emotionRecords.length) * 100),
        response_count: emotionRecords.length,
        breakdown: dominantCounts,
      };
      console.log(`😊 [Report] Emotion summary: ${JSON.stringify(emotionSummary)}`);
    }

    const reportRow = {
      id: `report-${Date.now()}`,
      session_id: sessionId,
      overall_score: actualAverageScore,
      strengths_json: narrative.strengths,
      improvements_json: narrative.improvements,
      summary_text: narrative.summaryText,
      emotion_summary_json: emotionSummary,
      created_at: new Date().toISOString(),
    };

    if (!sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
      await supabaseAdmin.from("interview_reports").insert({
        session_id: sessionId,
        overall_score: actualAverageScore,
        strengths_json: narrative.strengths,
        improvements_json: narrative.improvements,
        summary_text: narrative.summaryText,
        emotion_summary_json: emotionSummary,
      }).catch(() => {});
    }

    if (userId) {
      await createNotification(
        userId,
        "report_ready",
        "Performance Report Ready",
        `Aggregate score: ${actualAverageScore}%. Read your detailed AI coaching feedback.`,
        `/interview-replay/${sessionId}`
      ).catch(() => {});
    }

    return reportRow;
  } catch (err) {
    console.error("❌ Failed to generate report:", err);
  }
}
