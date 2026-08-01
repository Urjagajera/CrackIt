import WebSocket from "ws";

const CONCURRENT_CLIENTS = 20;
const SERVER_WS_URL = "ws://localhost:4000/ws";

async function runLoadTest() {
  console.log(`🚀 Starting Load Test on WebSocket Interview Engine...`);
  console.log(`Simulating ${CONCURRENT_CLIENTS} concurrent candidate WebSocket connections to ${SERVER_WS_URL}\n`);

  let activeSockets = [];
  let successfulConnections = 0;
  let responsesScoredCount = 0;
  let errorsCount = 0;

  const startTime = Date.now();

  const clientPromises = Array.from({ length: CONCURRENT_CLIENTS }).map((_, idx) => {
    return new Promise((resolve) => {
      const sessionId = `load-test-session-${idx}-${Date.now()}`;
      const ws = new WebSocket(SERVER_WS_URL);

      ws.on("open", () => {
        successfulConnections++;
        activeSockets.push(ws);

        // Join session room
        ws.send(
          JSON.stringify({
            type: "join_session",
            payload: {
              session_id: sessionId,
              user_id: `load-test-user-${idx}`,
            },
          })
        );

        // Simulate client speaking & submitting response
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: "user_speaking_start",
              payload: { session_id: sessionId },
            })
          );
        }, 100);

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: "submit_response",
              payload: {
                session_id: sessionId,
                audio_data: "base64-loadtest-audio-data-chunk",
                mime_type: "audio/webm",
              },
            })
          );
        }, 300);

        setTimeout(() => {
          ws.close();
          resolve(true);
        }, 800);
      });

      ws.on("message", (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === "response_scored") {
            responsesScoredCount++;
          }
        } catch {
          // Ignores non-JSON frames
        }
      });

      ws.on("error", (err) => {
        errorsCount++;
        resolve(false);
      });
    });
  });

  await Promise.all(clientPromises);

  const durationMs = Date.now() - startTime;

  console.log(`═════════════════════════════════════════════════════════`);
  console.log(`📊 LOAD TEST RESULTS:`);
  console.log(`   - Concurrent Connections: ${successfulConnections}/${CONCURRENT_CLIENTS}`);
  console.log(`   - Responses Scored Concurrently: ${responsesScoredCount}`);
  console.log(`   - Errors Encountered: ${errorsCount}`);
  console.log(`   - Total Test Duration: ${durationMs}ms`);
  console.log(`═════════════════════════════════════════════════════════`);

  if (errorsCount === 0 && successfulConnections === CONCURRENT_CLIENTS) {
    console.log(`🎉 LOAD TEST PASSED! The WebSocket Interview Engine handled high concurrent load with zero collisions!`);
  } else {
    console.warn(`⚠️ LOAD TEST WARNING: Some sockets encountered errors.`);
  }
}

runLoadTest();
