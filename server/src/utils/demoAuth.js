import { env } from "../config/env.js";

/**
 * Helper to check if Supabase URL is using placeholder credentials
 */
export const isPlaceholderSupabase = Boolean(
  !env.SUPABASE_URL ||
    env.SUPABASE_URL.includes("placeholder") ||
    env.SUPABASE_URL.includes("example.com") ||
    !env.SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY.includes("placeholder")
);

// In-memory demo users store, initialized with default demo credentials:
// email: urja@demo.com
// name: urja
// password: password123
const demoUsers = new Map([
  [
    "urja@demo.com",
    {
      user: {
        id: "demo-user-urja-12345",
        email: "urja@demo.com",
        user_metadata: { full_name: "urja" },
        created_at: new Date().toISOString(),
      },
      password: "password123",
      profile: {
        id: "demo-user-urja-12345",
        full_name: "urja",
        target_role: "Senior Software Engineer",
        experience_level: "mid",
        career_stage: "mid_career",
        bio: "Full Stack Engineer & AI Enthusiast",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tokens: {
        accessToken: "demo-token-urja-access",
        refreshToken: "demo-token-urja-refresh",
      },
    },
  ],
]);

// Map access token -> user & profile record
const demoTokens = new Map([
  [
    "demo-token-urja-access",
    {
      user: demoUsers.get("urja@demo.com").user,
      profile: demoUsers.get("urja@demo.com").profile,
    },
  ],
]);

export function registerDemoUser(email, password, fullName = "") {
  const normalizedEmail = email.toLowerCase().trim();
  const userId = `demo-user-${Date.now()}`;
  const accessToken = `demo-token-${userId}-access`;
  const refreshToken = `demo-token-${userId}-refresh`;

  const record = {
    user: {
      id: userId,
      email: normalizedEmail,
      user_metadata: { full_name: fullName || "urja" },
      created_at: new Date().toISOString(),
    },
    password,
    profile: {
      id: userId,
      full_name: fullName || "urja",
      target_role: "Software Engineer",
      experience_level: "mid",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };

  demoUsers.set(normalizedEmail, record);
  demoTokens.set(accessToken, { user: record.user, profile: record.profile });

  return record;
}

export function authenticateDemoUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();
  const record = demoUsers.get(normalizedEmail);
  if (record && record.password === password) {
    return record;
  }
  return null;
}

export function getDemoUserByToken(token) {
  return demoTokens.get(token) || null;
}
