-- ============================================================
-- CrackIt — 001 Schema Migration
-- Creates all tables, custom types, foreign keys, and indexes.
-- Run against a fresh Supabase project (Postgres 15+).
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid(), crypt()
CREATE EXTENSION IF NOT EXISTS "moddatetime";   -- auto-update updated_at triggers


-- ────────────────────────────────────────────────────────────
-- 2. CUSTOM ENUM TYPES
-- ────────────────────────────────────────────────────────────
CREATE TYPE resume_status     AS ENUM ('pending', 'parsing', 'parsed', 'error');
CREATE TYPE interview_type    AS ENUM ('behavioral', 'technical', 'system_design', 'hr', 'mixed');
CREATE TYPE difficulty_level  AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE session_status    AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'abandoned');
CREATE TYPE experience_level  AS ENUM ('student', 'entry', 'junior', 'mid', 'senior', 'lead', 'principal');


-- ────────────────────────────────────────────────────────────
-- 3. TABLES (ordered by dependency — parents first)
-- ────────────────────────────────────────────────────────────

-- 3a. profiles ──────────────────────────────────────────────
-- One-to-one with auth.users.  Created via a trigger on signup.
CREATE TABLE profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL DEFAULT '',
  target_role      TEXT,                          -- e.g. "Senior Frontend Engineer"
  experience_level experience_level DEFAULT 'mid',
  career_stage     TEXT,                          -- free-text: "career_change", "student", etc.
  bio              TEXT,                          -- ← ADDED: short professional summary
  linkedin_url     TEXT,                          -- ← ADDED: common in interview-prep apps
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  profiles IS 'Extended user profile — mirrors auth.users 1:1.';
COMMENT ON COLUMN profiles.career_stage IS 'Free-text career stage (exploring, early_career, mid_career, career_change, etc.)';


-- 3b. resumes ───────────────────────────────────────────────
CREATE TABLE resumes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  original_filename TEXT,                         -- ← ADDED: display name in the UI
  file_url          TEXT NOT NULL,                -- Supabase Storage path
  parsed_json       JSONB,                        -- AI-extracted structured resume data
  status            resume_status NOT NULL DEFAULT 'pending',
  uploaded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE resumes IS 'Uploaded resumes with AI-parsed JSON representation.';


-- 3c. resume_skills ─────────────────────────────────────────
CREATE TABLE resume_skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id   UUID NOT NULL REFERENCES resumes (id) ON DELETE CASCADE,
  skill       TEXT NOT NULL,
  proficiency TEXT,                               -- e.g. "advanced", "beginner"
  source      TEXT                                -- "resume", "user_added", "ai_inferred"
);

COMMENT ON TABLE resume_skills IS 'Individual skills extracted from (or added to) a resume.';


-- 3d. jobs ──────────────────────────────────────────────────
CREATE TABLE jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  company     TEXT,
  jd_text     TEXT,                               -- full job-description body
  jd_url      TEXT,                               -- original posting URL
  location    TEXT,                               -- ← ADDED: remote / city
  salary_range TEXT,                              -- ← ADDED: informational
  status      TEXT NOT NULL DEFAULT 'active',     -- ← ADDED: active | archived
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE jobs IS 'Job postings saved by the user for match analysis and targeted practice.';


-- 3e. job_matches ───────────────────────────────────────────
CREATE TABLE job_matches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  resume_id         UUID NOT NULL REFERENCES resumes (id) ON DELETE CASCADE,
  match_score       NUMERIC(5,2),                 -- 0.00 – 100.00
  gap_analysis_json JSONB,                        -- { missing_skills, recommendations, … }
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE job_matches IS 'AI-generated match score + gap analysis between a resume and a job.';


-- 3f. projects ──────────────────────────────────────────────
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  tech_stack  TEXT[],                             -- e.g. {"React", "Node.js", "PostgreSQL"}
  source_url  TEXT,                               -- GitHub / live link
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(), -- ← ADDED
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()  -- ← ADDED
);

COMMENT ON TABLE projects IS 'User portfolio projects for AI-powered talking-point generation.';


-- 3g. project_analyses ──────────────────────────────────────
CREATE TABLE project_analyses (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id               UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  insights_json            JSONB,                 -- { complexity, patterns, strengths }
  suggested_talking_points JSONB,                 -- [ { point, context, star_format }, … ]
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()  -- ← ADDED
);

COMMENT ON TABLE project_analyses IS 'AI-generated insights and STAR-format talking points for a project.';


-- 3h. interview_sessions ────────────────────────────────────
CREATE TABLE interview_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  job_id       UUID REFERENCES jobs (id) ON DELETE SET NULL,  -- nullable: practice without a target job
  title        TEXT,                              -- ← ADDED: user-facing label ("Mock #3 – Google SWE")
  type         interview_type NOT NULL DEFAULT 'mixed',
  difficulty   difficulty_level NOT NULL DEFAULT 'medium',
  duration_min INT,                               -- planned duration
  status       session_status NOT NULL DEFAULT 'scheduled',
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now() -- ← ADDED: when the session was created vs started
);

COMMENT ON TABLE interview_sessions IS 'A single mock interview practice session.';


-- 3i. interview_questions ───────────────────────────────────
CREATE TABLE interview_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES interview_sessions (id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category      TEXT,                             -- behavioral, technical, situational, etc.
  order_index   INT NOT NULL DEFAULT 0,
  generated_by  TEXT NOT NULL DEFAULT 'ai'        -- "ai", "template", "user"
);

COMMENT ON TABLE interview_questions IS 'Ordered questions within an interview session.';


-- 3j. interview_responses ───────────────────────────────────
CREATE TABLE interview_responses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id      UUID NOT NULL REFERENCES interview_questions (id) ON DELETE CASCADE,
  session_id       UUID NOT NULL REFERENCES interview_sessions (id) ON DELETE CASCADE,  -- ← ADDED: denormalized for RLS + queries
  transcript       TEXT,                          -- speech-to-text output
  audio_url        TEXT,                          -- Supabase Storage path
  response_time_sec INT,                          -- how long the user took
  score_json       JSONB,                         -- { overall, clarity, relevance, depth, … }
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()  -- ← ADDED
);

COMMENT ON TABLE  interview_responses IS 'User answer to a single interview question — transcript + audio + AI scoring.';
COMMENT ON COLUMN interview_responses.session_id IS 'Denormalized from interview_questions for faster RLS checks and direct session queries.';


-- 3k. interview_reports ─────────────────────────────────────
CREATE TABLE interview_reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL REFERENCES interview_sessions (id) ON DELETE CASCADE,
  overall_score     NUMERIC(5,2),                 -- 0.00 – 100.00
  strengths_json    JSONB,                        -- [ { area, detail }, … ]
  improvements_json JSONB,                        -- [ { area, detail, suggestion }, … ]
  summary_text      TEXT,                         -- human-readable summary paragraph
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()  -- ← ADDED
);

COMMENT ON TABLE interview_reports IS 'Post-session aggregate report with scores, strengths, and improvement areas.';


-- 3l. analytics_snapshots ───────────────────────────────────
CREATE TABLE analytics_snapshots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  period       TEXT NOT NULL,                     -- "daily", "weekly", "monthly"
  metrics_json JSONB NOT NULL,                    -- { sessions_completed, avg_score, streaks, … }
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE analytics_snapshots IS 'Pre-computed analytics rollups per user per time period.';


-- 3m. notifications ─────────────────────────────────────────
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  type         TEXT NOT NULL,                     -- "report_ready", "weekly_summary", "achievement", etc.
  title        TEXT,                              -- ← ADDED: short headline for the notification
  payload_json JSONB,                             -- flexible payload (link, metadata, etc.)
  read_at      TIMESTAMPTZ,                       -- NULL = unread
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE notifications IS 'In-app notification feed.';


-- 3n. user_settings ─────────────────────────────────────────
CREATE TABLE user_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES profiles (id) ON DELETE CASCADE,
  preferences_json JSONB NOT NULL DEFAULT '{}'::jsonb,  -- { theme, email_notifications, voice_speed, … }
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),  -- ← ADDED
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()   -- ← ADDED
);

COMMENT ON TABLE user_settings IS 'Per-user app preferences (theme, notification prefs, voice settings, etc.).';


-- ────────────────────────────────────────────────────────────
-- 4. INDEXES
-- ────────────────────────────────────────────────────────────

-- user_id indexes (every user-owned table)
CREATE INDEX idx_resumes_user_id               ON resumes (user_id);
CREATE INDEX idx_jobs_user_id                  ON jobs (user_id);
CREATE INDEX idx_projects_user_id              ON projects (user_id);
CREATE INDEX idx_interview_sessions_user_id    ON interview_sessions (user_id);
CREATE INDEX idx_analytics_snapshots_user_id   ON analytics_snapshots (user_id);
CREATE INDEX idx_notifications_user_id         ON notifications (user_id);

-- session_id indexes (child tables of interview_sessions)
CREATE INDEX idx_interview_questions_session_id  ON interview_questions (session_id);
CREATE INDEX idx_interview_responses_session_id  ON interview_responses (session_id);
CREATE INDEX idx_interview_responses_question_id ON interview_responses (question_id);
CREATE INDEX idx_interview_reports_session_id    ON interview_reports (session_id);

-- parent FK indexes on child tables
CREATE INDEX idx_resume_skills_resume_id     ON resume_skills (resume_id);
CREATE INDEX idx_job_matches_job_id          ON job_matches (job_id);
CREATE INDEX idx_job_matches_resume_id       ON job_matches (resume_id);
CREATE INDEX idx_project_analyses_project_id ON project_analyses (project_id);

-- status indexes (frequently filtered)
CREATE INDEX idx_resumes_status              ON resumes (status);
CREATE INDEX idx_jobs_status                 ON jobs (status);
CREATE INDEX idx_interview_sessions_status   ON interview_sessions (status);

-- notifications: unread-first listing
CREATE INDEX idx_notifications_unread ON notifications (user_id, created_at DESC) WHERE read_at IS NULL;


-- ────────────────────────────────────────────────────────────
-- 5. AUTO-UPDATE updated_at TRIGGERS
-- ────────────────────────────────────────────────────────────

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);


-- ────────────────────────────────────────────────────────────
-- 6. AUTO-CREATE PROFILE ON SIGNUP (Supabase trigger)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
