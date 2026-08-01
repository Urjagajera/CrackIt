-- ============================================================
-- CrackIt — 011 Interview Media Migration
-- Adds video recording and emotion analysis columns.
-- Run against your Supabase project after 001–003 migrations.
-- ============================================================

-- Add video_url to interview_sessions (one video per session)
ALTER TABLE interview_sessions
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add emotion_summary_json to interview_responses (per-response)
ALTER TABLE interview_responses
  ADD COLUMN IF NOT EXISTS emotion_summary_json JSONB;

COMMENT ON COLUMN interview_sessions.video_url IS
  'URL to session recording in Supabase Storage bucket interview-videos';

COMMENT ON COLUMN interview_responses.emotion_summary_json IS
  'Aggregated face-api.js emotion detection per response: { dominant_emotion, avg_confidence, avg_nervousness }';

-- Create Supabase Storage bucket (run once via dashboard or Management API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('interview-videos', 'interview-videos', false)
-- ON CONFLICT DO NOTHING;

-- RLS: users can only read their own interview videos
-- (Policies applied in 002_rls_policies.sql — add these manually if needed)
-- CREATE POLICY "Users can read own session videos" ON storage.objects FOR SELECT USING (
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
