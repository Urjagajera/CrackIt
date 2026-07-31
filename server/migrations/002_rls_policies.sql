-- ============================================================
-- CrackIt — 002 Row Level Security Policies
-- Enables RLS on every table and adds ownership-based policies.
--
-- Principle: a user can only access rows they own, verified via
-- auth.uid() matching user_id (direct or via parent join).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENABLE RLS ON ALL TABLES
-- ────────────────────────────────────────────────────────────
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_analyses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings       ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- 2. POLICIES — DIRECT OWNERSHIP TABLES
--    These tables have a user_id (or id for profiles) that
--    directly matches auth.uid().
-- ────────────────────────────────────────────────────────────

-- ── profiles ────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT handled by the on_auth_user_created trigger (SECURITY DEFINER).
-- DELETE cascades from auth.users.


-- ── resumes ─────────────────────────────────────────────────
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (user_id = auth.uid());


-- ── jobs ────────────────────────────────────────────────────
CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  USING (user_id = auth.uid());


-- ── projects ────────────────────────────────────────────────
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (user_id = auth.uid());


-- ── interview_sessions ──────────────────────────────────────
CREATE POLICY "Users can view own sessions"
  ON interview_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON interview_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON interview_sessions FOR DELETE
  USING (user_id = auth.uid());


-- ── analytics_snapshots ─────────────────────────────────────
CREATE POLICY "Users can view own analytics"
  ON analytics_snapshots FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own analytics"
  ON analytics_snapshots FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Analytics are server-generated; no user UPDATE/DELETE needed.


-- ── notifications ───────────────────────────────────────────
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
  -- Allows marking as read. INSERT is server-side only.

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());


-- ── user_settings ───────────────────────────────────────────
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ────────────────────────────────────────────────────────────
-- 3. POLICIES — CHILD TABLES (ownership via parent join)
--    Uses EXISTS subqueries which Postgres optimizes well
--    with the FK indexes we created in 001_schema.sql.
-- ────────────────────────────────────────────────────────────

-- ── resume_skills (child of resumes) ────────────────────────
CREATE POLICY "Users can view own resume skills"
  ON resume_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_skills.resume_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own resume skills"
  ON resume_skills FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_skills.resume_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own resume skills"
  ON resume_skills FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_skills.resume_id
        AND r.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_skills.resume_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own resume skills"
  ON resume_skills FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_skills.resume_id
        AND r.user_id = auth.uid()
    )
  );


-- ── job_matches (child of jobs + resumes) ───────────────────
-- Ownership verified through the job (user must own the job).
CREATE POLICY "Users can view own job matches"
  ON job_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_matches.job_id
        AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own job matches"
  ON job_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_matches.job_id
        AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own job matches"
  ON job_matches FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_matches.job_id
        AND j.user_id = auth.uid()
    )
  );


-- ── project_analyses (child of projects) ────────────────────
CREATE POLICY "Users can view own project analyses"
  ON project_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_analyses.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own project analyses"
  ON project_analyses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_analyses.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own project analyses"
  ON project_analyses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_analyses.project_id
        AND p.user_id = auth.uid()
    )
  );


-- ── interview_questions (child of interview_sessions) ───────
CREATE POLICY "Users can view own interview questions"
  ON interview_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_questions.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own interview questions"
  ON interview_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_questions.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own interview questions"
  ON interview_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_questions.session_id
        AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_questions.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own interview questions"
  ON interview_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_questions.session_id
        AND s.user_id = auth.uid()
    )
  );


-- ── interview_responses (child of interview_sessions) ───────
-- Uses denormalized session_id for single-hop RLS check.
CREATE POLICY "Users can view own interview responses"
  ON interview_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_responses.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own interview responses"
  ON interview_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_responses.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own interview responses"
  ON interview_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_responses.session_id
        AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_responses.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own interview responses"
  ON interview_responses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_responses.session_id
        AND s.user_id = auth.uid()
    )
  );


-- ── interview_reports (child of interview_sessions) ─────────
CREATE POLICY "Users can view own interview reports"
  ON interview_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_reports.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own interview reports"
  ON interview_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_reports.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own interview reports"
  ON interview_reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions s
      WHERE s.id = interview_reports.session_id
        AND s.user_id = auth.uid()
    )
  );
