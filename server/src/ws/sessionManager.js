import { supabaseAdmin } from "../config/supabase.js";
import { transcribeAudio } from "../services/sttService.js";
import { scoreResponse } from "../services/responseScorer.js";
import { generateReport } from "../services/reportGenerator.js";
import { createNotification } from "../services/notificationService.js";

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why are you interested in joining our company?",
  "Describe a challenging technical problem you solved recently.",
  "Could you describe a time you handled a conflict in your team?",
  "How do you prioritize tasks when working on multiple projects with tight deadlines?",
  "Explain hexagonal architecture and why you would use it.",
  "What is your approach to handling database failure in production?",
  "Tell me about a time you had to deliver negative feedback to a peer.",
  "How do you stay up-to-date with emerging software technologies?",
  "Do you have any questions for me?",
];

const activeSessions = new Map();
const completedSessionsStore = new Map();
const completedReportsStore = new Map();

export function getActiveSession(sessionId) {
  return activeSessions.get(sessionId);
}

export function getCompletedSession(sessionId) {
  return completedSessionsStore.get(sessionId);
}

export function getCompletedReport(sessionId) {
  return completedReportsStore.get(sessionId);
}

export function getCompletedReports(userId) {
  const userReports = [];
  for (const report of completedReportsStore.values()) {
    if (!userId || report.user_id === userId || userId.startsWith("demo-user-")) {
      userReports.push(report);
    }
  }
  return userReports;
}

/**
 * Called by videoController after successful video upload.
 * Updates the in-memory completed session so GET /replay can return video_url.
 */
export function setSessionVideoUrl(sessionId, videoUrl) {
  const record = completedSessionsStore.get(sessionId);
  if (record) {
    record.video_url = videoUrl;
  }
}

export function createOrGetSession(sessionId, userId) {
  let session = activeSessions.get(sessionId);

  if (session) {
    if (session.disconnectTimeout) {
      clearTimeout(session.disconnectTimeout);
      session.disconnectTimeout = null;
      console.log(`🔄 Client reconnected to active session ${sessionId}`);
    }
    return session;
  }

  session = {
    sessionId,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    elapsedSeconds: 0,
    totalDurationSeconds: 900, // 15 mins
    questions: DEFAULT_QUESTIONS,
    responses: [],
    messages: [
      {
        id: "msg-welcome-1",
        sender: "CrackIt",
        role: "ai",
        text: `Welcome! Let's start your mock interview round. We have ${DEFAULT_QUESTIONS.length} questions prepared.`,
        time: "00:00",
      },
      {
        id: "msg-q-0",
        sender: "CrackIt",
        role: "ai",
        text: DEFAULT_QUESTIONS[0],
        time: "00:00",
      },
    ],
    sockets: new Set(),
    timerInterval: null,
    disconnectTimeout: null,
  };

  // Start 1-second interval timer tick
  session.timerInterval = setInterval(() => {
    session.elapsedSeconds++;
    const remaining = Math.max(0, session.totalDurationSeconds - session.elapsedSeconds);

    broadcastToSession(session, {
      type: "timer_tick",
      payload: {
        elapsed_seconds: session.elapsedSeconds,
        remaining_seconds: remaining,
      },
    });

    if (remaining === 0) {
      endSession(session.sessionId);
    }
  }, 1000);

  activeSessions.set(sessionId, session);
  return session;
}

export function broadcastToSession(session, message) {
  const json = JSON.stringify(message);
  for (const ws of session.sockets) {
    if (ws.readyState === 1) { // OPEN
      ws.send(json);
    }
  }
}

export function addSocketToSession(sessionId, ws) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.sockets.add(ws);
  }
}

export function removeSocketFromSession(sessionId, ws) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.sockets.delete(ws);

    // If no sockets connected, start 10-minute reconnect buffer timer
    if (session.sockets.size === 0 && !session.disconnectTimeout) {
      console.log(`⏱️ Client disconnected from session ${sessionId}. Buffering state for 10 mins...`);
      session.disconnectTimeout = setTimeout(() => {
        console.log(`🧹 Cleaning up abandoned session ${sessionId}`);
        endSession(sessionId);
      }, 10 * 60 * 1000);
    }
  }
}

export async function processUserResponse(sessionId, payload) {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  // emotion_summary: { dominant_emotion, avg_confidence, avg_nervousness }
  // provided by the browser's face-api.js aggregation; null in fallback/manual mode.
  const { audio_base64, text, response_time_sec, emotion_summary } = payload;
  const currentQText = session.questions[session.currentQuestionIndex] || "Question";

  // 1. Transcribe audio if present via STT placeholder
  let transcript = text || "";
  if (audio_base64) {
    transcript = await transcribeAudio(audio_base64);
  }

  if (!transcript || transcript.trim().length === 0) {
    transcript = "Candidate answered the question.";
  }

  // 2. Add message to chat feed
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const userMsg = {
    id: `msg-user-${Date.now()}`,
    sender: "You",
    role: "user",
    text: transcript,
    time: formatTime(session.elapsedSeconds),
  };
  session.messages.push(userMsg);

  broadcastToSession(session, {
    type: "transcription_update",
    payload: { transcript, message: userMsg },
  });

  // 3. Score response via AI Response Scorer placeholder
  const scoring = await scoreResponse(transcript, currentQText, {
    sessionId,
    userId: session.userId,
  });

  const responseRecord = {
    id: `resp-${Date.now()}`,
    question_index: session.currentQuestionIndex,
    question_text: currentQText,
    transcript,
    response_time_sec: response_time_sec || 45,
    score_json: scoring.score_json,
    emotion_summary_json: emotion_summary || null,
  };

  session.responses.push(responseRecord);

  // 4. Save to DB interview_responses if real UUID
  if (!sessionId.startsWith("demo-session-") && !sessionId.startsWith("session-")) {
    await supabaseAdmin
      .from("interview_responses")
      .insert({
        session_id: sessionId,
        question_id: null,
        transcript,
        response_time_sec: response_time_sec || 45,
        score_json: scoring.score_json,
        emotion_summary_json: emotion_summary || null,
      })
      .catch(() => {});
  }

  broadcastToSession(session, {
    type: "response_scored",
    payload: {
      response_id: responseRecord.id,
      score_json: scoring.score_json,
      overall_score: scoring.overall_score,
    },
  });

  // 5. Advance to next question automatically
  advanceSessionQuestion(sessionId);
}

export function advanceSessionQuestion(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  session.currentQuestionIndex++;

  if (session.currentQuestionIndex >= session.questions.length) {
    endSession(sessionId);
    return;
  }

  const nextQText = session.questions[session.currentQuestionIndex];
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const aiMsg = {
    id: `msg-q-${session.currentQuestionIndex}`,
    sender: "CrackIt",
    role: "ai",
    text: nextQText,
    time: formatTime(session.elapsedSeconds),
  };
  session.messages.push(aiMsg);

  broadcastToSession(session, {
    type: "question_delivered",
    payload: {
      question_index: session.currentQuestionIndex,
      question_text: nextQText,
      total_questions: session.questions.length,
      message: aiMsg,
    },
  });
}

export async function endSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  if (session.timerInterval) {
    clearInterval(session.timerInterval);
    session.timerInterval = null;
  }
  if (session.disconnectTimeout) {
    clearTimeout(session.disconnectTimeout);
    session.disconnectTimeout = null;
  }

  session.status = "completed";

  // Generate aggregate performance report with actual response scores
  const report = await generateReport(sessionId, session.userId, session.responses);

  const completedRecord = {
    sessionId: session.sessionId,
    userId: session.userId,
    title: "Technical Mock Interview",
    company: "Target Placement",
    messages: session.messages,
    responses: session.responses,
    elapsedSeconds: session.elapsedSeconds,
    video_url: null, // populated later by videoController after upload
    created_at: new Date().toISOString(),
  };

  completedSessionsStore.set(sessionId, completedRecord);
  if (report) {
    completedReportsStore.set(sessionId, {
      ...report,
      user_id: session.userId,
      title: "Technical Mock Interview",
      created_at: new Date().toISOString(),
    });
  }

  // Trigger real notification for completed session
  await createNotification(
    session.userId,
    "session_completed",
    "Interview Session Completed!",
    "Your mock round has finished. View your score breakdown and AI coaching feedback.",
    `/interview-replay/${sessionId}`
  ).catch(() => {});

  broadcastToSession(session, {
    type: "session_completed",
    payload: {
      session_id: sessionId,
      summary: report?.summary_text || "Session completed successfully.",
      report_id: report?.id || `report-${sessionId}`,
    },
  });

  activeSessions.delete(sessionId);
}
