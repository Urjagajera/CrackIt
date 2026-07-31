import { Router } from "express";
import { supabaseAdmin } from "../config/index.js";

const router = Router();

/**
 * GET /api/health
 *
 * Returns { status: "ok", supabase: "connected" | "error" }
 * Performs a real round-trip to Supabase to verify connectivity.
 */
router.get("/", async (_req, res, next) => {
  try {
    // A lightweight query — reads the current server timestamp.
    // Uses the admin client so it doesn't need a user session.
    const { error } = await supabaseAdmin.rpc("now");

    // If the RPC doesn't exist (fresh project), fall back to a simple
    // query against the built-in auth schema which always exists.
    if (error && error.message?.includes("function") ) {
      const { error: fallbackError } = await supabaseAdmin.auth.getUser(
        "00000000-0000-0000-0000-000000000000",
      );
      // getUser returns an error for a non-existent user, but the fact
      // that it responded means Supabase is reachable.
      if (fallbackError && fallbackError.message?.includes("fetch")) {
        throw fallbackError;
      }
    } else if (error && error.message?.includes("fetch")) {
      // Genuine network error
      throw error;
    }

    res.json({ status: "ok", supabase: "connected" });
  } catch (err) {
    // Supabase unreachable — still return 200 but flag the problem
    console.error("⚠️  Supabase health-check failed:", err.message);
    res.json({ status: "ok", supabase: "error" });
  }
});

export default router;
