/**
 * Centralized error-handling middleware.
 *
 * Catches anything thrown or passed via next(err) and returns a
 * consistent JSON shape: { error: { message, code } }
 */

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || "INTERNAL_ERROR";

  // Log the full error in development; only the message in production
  if (process.env.NODE_ENV !== "production") {
    console.error("🔥  Error:", err);
  } else {
    console.error(`🔥  [${code}] ${err.message}`);
  }

  res.status(statusCode).json({
    error: {
      message:
        statusCode === 500 && process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message || "Internal server error",
      code,
    },
  });
}
