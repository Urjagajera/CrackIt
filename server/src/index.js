/**
 * CrackIt API — Entry Point
 *
 * Loads environment variables first, then boots the Express server.
 */
import "dotenv/config";
import { env } from "./config/index.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────┐
  │                                          │
  │   🎤  CrackIt API Server                │
  │                                          │
  │   Port : ${String(env.PORT).padEnd(30)}│
  │   Env  : ${env.NODE_ENV.padEnd(30)}│
  │                                          │
  │   Health → http://localhost:${env.PORT}/api/health  │
  │                                          │
  └──────────────────────────────────────────┘
  `);
});
