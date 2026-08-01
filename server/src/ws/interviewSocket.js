import { WebSocketServer } from "ws";
import {
  createOrGetSession,
  addSocketToSession,
  removeSocketFromSession,
  processUserResponse,
  advanceSessionQuestion,
  endSession,
  broadcastToSession,
} from "./sessionManager.js";

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CrackIt — WebSocket Interview Engine Protocol (Sprint 11 updated)
 * Transport: ws (native WebSocket, no socket.io)
 * Endpoint:  ws://host/ws  (or /api/ws — both accepted)
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * ── CLIENT → SERVER ─────────────────────────────────────────────────────────
 *
 * join_session
 *   { type: "join_session", payload: { session_id, user_id } }
 *   → Creates or reconnects to a session. Server replies with session_state.
 *
 * user_speaking_start
 *   { type: "user_speaking_start", payload: {} }
 *   → Broadcasts to all peers in the session room that the user has started speaking.
 *
 * submit_response          ← Sprint 11: now carries browser-native STT text + emotion
 *   { type: "submit_response", payload: {
 *       text: string,             // Browser SpeechRecognition transcript (or manual text)
 *       response_time_sec: number,
 *       emotion_summary: {        // face-api.js aggregation — null in Firefox/Safari fallback
 *         dominant_emotion: string,   // "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "neutral"
 *         avg_confidence: number,     // 0–1 (fraction from face-api expressions)
 *         avg_nervousness: number,    // derived: fearful + surprised averaged
 *       } | null
 *   } }
 *   → Scores the response, advances to next question, broadcasts question_delivered.
 *
 * next_question
 *   { type: "next_question", payload: {} }
 *   → Manually skip to next question without submitting a response.
 *
 * end_session
 *   { type: "end_session", payload: {} }
 *   → Ends session early. Server generates report and broadcasts session_completed.
 *
 * ── SERVER → CLIENT ─────────────────────────────────────────────────────────
 *
 * session_state            → Full current session state on join/reconnect
 *   { type: "session_state", payload: { session_id, current_question_index,
 *     current_question, total_questions, elapsed_seconds, remaining_seconds,
 *     status, messages[] } }
 *
 * timer_tick               → Sent every second
 *   { type: "timer_tick", payload: { elapsed_seconds, remaining_seconds } }
 *
 * question_delivered       → Sent after each response is scored / next question advances
 *   { type: "question_delivered", payload: { question_index, question_text,
 *     total_questions, message } }
 *   Frontend: speak question_text with SpeechSynthesis on receipt.
 *
 * transcription_update     → Sent immediately after STT transcript received
 *   { type: "transcription_update", payload: { transcript, message } }
 *
 * response_scored          → Sent after scoring completes
 *   { type: "response_scored", payload: { response_id, score_json, overall_score } }
 *
 * session_completed        → Sent when all questions answered or end_session received
 *   { type: "session_completed", payload: { session_id, summary, report_id } }
 *   Frontend: stop MediaRecorder, upload video blob, navigate to replay.
 *
 * error
 *   { type: "error", payload: { message, code } }
 *
 * ══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Attaches the native WebSocket Server to the Express HTTP Server.
 *
 * @param {import('http').Server} httpServer
 */
export function setupWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    if (pathname === "/ws" || pathname === "/api/ws" || pathname.startsWith("/ws/")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws, req) => {
    let currentSessionId = null;
    let currentUserId = "anonymous";

    console.log("🔌 New WebSocket client connected to Interview Engine.");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, payload = {} } = message;

        switch (type) {
          case "join_session": {
            const { session_id = "demo-session-1", user_id = "demo-user-urja-12345" } = payload;
            currentSessionId = session_id;
            currentUserId = user_id;

            const session = createOrGetSession(currentSessionId, currentUserId);
            addSocketToSession(currentSessionId, ws);

            // Send full current session state back to client
            const remaining = Math.max(0, session.totalDurationSeconds - session.elapsedSeconds);
            ws.send(
              JSON.stringify({
                type: "session_state",
                payload: {
                  session_id: session.sessionId,
                  current_question_index: session.currentQuestionIndex,
                  current_question: session.questions[session.currentQuestionIndex] || "",
                  total_questions: session.questions.length,
                  elapsed_seconds: session.elapsedSeconds,
                  remaining_seconds: remaining,
                  status: session.status,
                  messages: session.messages,
                },
              })
            );
            break;
          }

          case "user_speaking_start": {
            if (currentSessionId) {
              const session = createOrGetSession(currentSessionId, currentUserId);
              broadcastToSession(session, {
                type: "user_speaking_start",
                payload: { user_id: currentUserId },
              });
            }
            break;
          }

          case "user_speaking_end":
          case "submit_response": {
            if (currentSessionId) {
              await processUserResponse(currentSessionId, payload);
            }
            break;
          }

          case "next_question": {
            if (currentSessionId) {
              advanceSessionQuestion(currentSessionId);
            }
            break;
          }

          case "end_session": {
            if (currentSessionId) {
              await endSession(currentSessionId);
            }
            break;
          }

          default:
            console.warn("Unknown WS message type received:", type);
        }
      } catch (err) {
        console.error("Error processing WS message:", err);
        ws.send(
          JSON.stringify({
            type: "error",
            payload: { message: "Invalid JSON or payload error", code: "BAD_REQUEST" },
          })
        );
      }
    });

    ws.on("close", () => {
      console.log(`🔌 Client disconnected from session ${currentSessionId || "unknown"}`);
      if (currentSessionId) {
        removeSocketFromSession(currentSessionId, ws);
      }
    });

    ws.on("error", (err) => {
      console.error("WebSocket socket error:", err);
    });
  });

  console.log("⚡ [WebSocket] Interview Engine WebSocket Server attached to /ws");
}
