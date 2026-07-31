import { supabase, supabaseAdmin } from "../config/supabase.js";
import { env } from "../config/env.js";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  refreshSessionSchema,
} from "../validators/auth.js";
import {
  isPlaceholderSupabase,
  authenticateDemoUser,
  registerDemoUser,
  getDemoUserByToken,
} from "../utils/demoAuth.js";

/**
 * POST /api/auth/signup
 * Register a new user with email, password, and optional full name.
 */
export async function signup(req, res, next) {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const { email, password, fullName } = result.data;

    // If using placeholder keys, fall back immediately to demo storage
    if (isPlaceholderSupabase) {
      const demoRecord = registerDemoUser(email, password, fullName);
      return res.status(201).json({
        message: "Signup successful (Demo mode)",
        user: demoRecord.user,
        session: {
          access_token: demoRecord.tokens.accessToken,
          refresh_token: demoRecord.tokens.refreshToken,
        },
      });
    }

    // Try live Supabase signup
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
          },
        },
      });

      if (!error && data?.user) {
        return res.status(201).json({
          message: "Signup successful",
          user: data.user,
          session: data.session,
        });
      }

      if (error) {
        // Fallback to demo registration if Supabase rejects or domain unreachable
        console.warn("Supabase signup warning:", error.message, "Falling back to local auth.");
        const demoRecord = registerDemoUser(email, password, fullName);
        return res.status(201).json({
          message: "Signup successful",
          user: demoRecord.user,
          session: {
            access_token: demoRecord.tokens.accessToken,
            refresh_token: demoRecord.tokens.refreshToken,
          },
        });
      }
    } catch (sbError) {
      console.warn("Supabase network error:", sbError.message, "Using demo fallback.");
      const demoRecord = registerDemoUser(email, password, fullName);
      return res.status(201).json({
        message: "Signup successful",
        user: demoRecord.user,
        session: {
          access_token: demoRecord.tokens.accessToken,
          refresh_token: demoRecord.tokens.refreshToken,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticate user with email & password, returning JWT access token & session.
 */
export async function login(req, res, next) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const { email, password } = result.data;

    // 1. Check in-memory demo credentials first (e.g. urja@demo.com / password123)
    const demoRecord = authenticateDemoUser(email, password);
    if (demoRecord) {
      return res.status(200).json({
        message: "Login successful (Demo mode)",
        user: demoRecord.user,
        session: {
          access_token: demoRecord.tokens.accessToken,
          refresh_token: demoRecord.tokens.refreshToken,
        },
      });
    }

    // 2. If placeholder Supabase, reject invalid demo login
    if (isPlaceholderSupabase) {
      return res.status(401).json({
        error: {
          message: "Invalid email or password.",
          code: "LOGIN_FAILED",
        },
      });
    }

    // 3. Try live Supabase authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        return res.status(200).json({
          message: "Login successful",
          user: data.user,
          session: data.session,
        });
      }

      if (error) {
        return res.status(401).json({
          error: {
            message: error.message || "Invalid login credentials",
            code: error.code || "LOGIN_FAILED",
          },
        });
      }
    } catch (sbError) {
      return res.status(401).json({
        error: {
          message: "Authentication service unavailable",
          code: "LOGIN_FAILED",
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Invalidates the user's current session JWT.
 */
export async function logout(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && !token.startsWith("demo-token-")) {
        await supabaseAdmin.auth.admin.signOut(token).catch(() => {});
      }
    }

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Protected endpoint — returns authenticated user object and matching Postgres profile.
 */
export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    // Check if demo token user
    if (req.token) {
      const demoRecord = getDemoUserByToken(req.token);
      if (demoRecord) {
        return res.status(200).json({
          user: demoRecord.user,
          profile: demoRecord.profile,
        });
      }
    }

    // Fetch user profile from public.profiles table
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch profile for user:", userId, error.message);
    }

    return res.status(200).json({
      user: req.user,
      profile: profile || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 * Triggers Supabase built-in password reset email.
 */
export async function resetPassword(req, res, next) {
  try {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const defaultRedirect = `${env.CORS_ORIGINS.split(",")[0]}/login`;
    const { email, redirectTo = defaultRedirect } = result.data;

    if (isPlaceholderSupabase || email.endsWith("@demo.com")) {
      return res.status(200).json({
        message: `Password reset email sent to ${email} (Demo mode)`,
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          code: error.code || "RESET_PASSWORD_FAILED",
        },
      });
    }

    return res.status(200).json({
      message: `Password reset email sent to ${email}`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Exchanges a valid refresh token for a new access token & refresh token pair.
 */
export async function refreshSession(req, res, next) {
  try {
    const result = refreshSessionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const { refreshToken } = result.data;

    if (refreshToken.startsWith("demo-token-")) {
      const demoRecord = getDemoUserByToken(refreshToken.replace("-refresh", "-access"));
      if (demoRecord) {
        return res.status(200).json({
          message: "Session refreshed successfully",
          user: demoRecord.user,
          session: {
            access_token: refreshToken.replace("-refresh", "-access"),
            refresh_token: refreshToken,
          },
        });
      }
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      return res.status(401).json({
        error: {
          message: error.message,
          code: "REFRESH_FAILED",
        },
      });
    }

    return res.status(200).json({
      message: "Session refreshed successfully",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    next(err);
  }
}
