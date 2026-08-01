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
