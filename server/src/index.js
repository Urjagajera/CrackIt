/**
 * CrackIt API — Entry Point
 *
 * Loads environment variables first, then boots the Express server.
 */
import "dotenv/config";
import http from "http";
import { env } from "./config/index.js";
import { createApp } from "./app.js";
import { setupWebSocketServer } from "./ws/interviewSocket.js";

const app = createApp();
const server = http.createServer(app);

// Attach WebSocket server for real-time interview engine
setupWebSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────┐
  │                                          │
  │   🎤  CrackIt API Server                │
  │                                          │
  │   Port : ${String(env.PORT).padEnd(30)}│
  │   Env  : ${env.NODE_ENV.padEnd(30)}│
  │                                          │
  │   Health → http://localhost:${env.PORT}/api/health  │
  │   WS     → ws://localhost:${env.PORT}/ws            │
  │                                          │
  └──────────────────────────────────────────┘
  `);
});

