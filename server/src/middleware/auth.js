import { supabase } from "../config/supabase.js";
import { getDemoUserByToken, isPlaceholderSupabase } from "../utils/demoAuth.js";

/**
 * Express middleware to authenticate requests via Supabase JWT or Demo Token.
 * Reads 'Authorization: Bearer <token>' header, validates token,
 * and attaches user object to `req.user`.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          message: "Missing or invalid authorization header. Expected 'Bearer <token>'",
          code: "UNAUTHORIZED",
        },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: {
          message: "Bearer token is empty",
          code: "UNAUTHORIZED",
        },
      });
    }

    // 1. Check if token is a demo token or server is in demo mode
    if (token.startsWith("demo-token-") || isPlaceholderSupabase) {
      const demoRecord = getDemoUserByToken(token);
      if (demoRecord) {
        req.user = demoRecord.user;
        req.token = token;
        return next();
      }
    }

    // 2. Try Supabase verification
    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (!error && data?.user) {
        req.user = data.user;
        req.token = token;
        return next();
      }
    } catch {
      // Fallback for network error / unreachable Supabase domain
    }

    // 3. Fallback check for demo record if Supabase call failed
    const fallbackDemo = getDemoUserByToken(token);
    if (fallbackDemo) {
      req.user = fallbackDemo.user;
      req.token = token;
      return next();
    }

    return res.status(401).json({
      error: {
        message: "Invalid or expired token",
        code: "UNAUTHORIZED",
      },
    });
  } catch (err) {
    next(err);
  }
}
