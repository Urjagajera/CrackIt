import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./middleware/index.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import apiRouter from "./routes/index.js";

/**
 * Creates and configures the Express application.
 * Separated from the listener so it can be imported in tests.
 */
export function createApp() {
  const app = express();

  // ── Security ──────────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────
  const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  // ── Body parsing ──────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Request logging ───────────────────────────────────
  const morganFormat = env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(morganFormat));

  // ── Rate Limiting & API routes ───────────────────────
  app.use("/api", globalRateLimiter, apiRouter);

  // ── Error handling (must come last) ───────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
