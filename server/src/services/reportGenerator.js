import { supabaseAdmin } from "../config/supabase.js";

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
 */
export async function generateReport(sessionId, userId) {
  try {
    console.log(`📊 [Report Generator] Generating final report for session ${sessionId}...`);

    let responses = [];
    let session = { id: sessionId, title: "Mock Interview Session" };

    if (!sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
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

    // Calculate average score across responses
    let totalScore = 0;
    let count = 0;

    for (const r of responses) {
      if (r.score_json?.overall_score) {
        totalScore += r.score_json.overall_score;
        count++;
      }
    }

    const overallScore = count > 0 ? Math.round(totalScore / count) : 84;

    const narrative = await generateNarrativeSummary(responses, session);

    const reportRow = {
      id: `report-${Date.now()}`,
      session_id: sessionId,
      overall_score: overallScore,
      strengths_json: narrative.strengths,
      improvements_json: narrative.improvements,
      summary_text: narrative.summaryText,
      created_at: new Date().toISOString(),
    };

    if (!sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
      await supabaseAdmin.from("interview_reports").insert({
        session_id: sessionId,
        overall_score: overallScore,
        strengths_json: narrative.strengths,
        improvements_json: narrative.improvements,
        summary_text: narrative.summaryText,
      }).catch(() => {});
    }

    return reportRow;
  } catch (err) {
    console.error("❌ Failed to generate report:", err);
  }
}
