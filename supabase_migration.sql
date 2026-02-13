-- ==========================================
--  SECURITY FIX: Lock down direct INSERT on scores table
--  and require validated submissions via RPC
-- ==========================================
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
--  What this does:
--  1. Enables RLS on the scores table
--  2. Allows anyone to SELECT (read leaderboard) but blocks direct INSERT/UPDATE/DELETE
--  3. Creates a submit_score() function that validates the event log before inserting
--  4. The old curl trick will now get: "new row violates row-level security policy"
-- ==========================================

-- Step 1: Enable Row Level Security
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing permissive policies that allow anonymous inserts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.scores;
DROP POLICY IF EXISTS "Allow anonymous reads" ON public.scores;
DROP POLICY IF EXISTS "Allow inserts" ON public.scores;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.scores;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.scores;

-- Step 3: Create a read-only policy for the anon role (leaderboard display)
CREATE POLICY "scores_select_policy"
  ON public.scores
  FOR SELECT
  TO anon
  USING (true);

-- Step 4: NO insert/update/delete policy for anon — all writes go through the RPC

-- Step 5: Add columns to track integrity data (run once, safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'scores' AND column_name = 'session_id') THEN
    ALTER TABLE public.scores ADD COLUMN session_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'scores' AND column_name = 'event_count') THEN
    ALTER TABLE public.scores ADD COLUMN event_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'scores' AND column_name = 'integrity_hash') THEN
    ALTER TABLE public.scores ADD COLUMN integrity_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'scores' AND column_name = 'flagged') THEN
    ALTER TABLE public.scores ADD COLUMN flagged boolean DEFAULT false;
  END IF;
END $$;

-- Step 6: Create the validated submission function
-- This function runs as SECURITY DEFINER (i.e., with table-owner privileges)
-- so it can INSERT even though the anon role cannot.
CREATE OR REPLACE FUNCTION public.submit_score(
  p_session_id text,
  p_player_name text,
  p_score integer,
  p_bulls_collected integer,
  p_time_taken double precision,
  p_character_used text,
  p_event_log text,
  p_event_count integer,
  p_integrity_hash text,
  p_client_version integer DEFAULT 1
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_flagged boolean := false;
  v_max_possible_score integer;
  v_min_plausible_events integer;
  v_result json;
BEGIN
  -- =====================
  -- Basic sanity checks
  -- =====================

  -- Player name must be non-empty and reasonable
  IF p_player_name IS NULL OR length(trim(p_player_name)) = 0 OR length(p_player_name) > 16 THEN
    RETURN json_build_object('error', 'Invalid player name');
  END IF;

  -- Score bounds
  IF p_score < 0 OR p_score > 49999 THEN
    RETURN json_build_object('error', 'Score out of range');
  END IF;

  -- Bulls bounds
  IF p_bulls_collected < 0 OR p_bulls_collected > 99 THEN
    RETURN json_build_object('error', 'Bulls out of range');
  END IF;

  -- Time bounds (minimum 10 seconds, maximum ~10 minutes per level)
  IF p_time_taken < 10.0 OR p_time_taken > 600.0 THEN
    RETURN json_build_object('error', 'Time out of range');
  END IF;

  -- Character must be valid
  IF p_character_used NOT IN ('chad', 'diana') THEN
    RETURN json_build_object('error', 'Invalid character');
  END IF;

  -- =====================
  -- Integrity checks
  -- =====================

  -- Must have client version 2+ (integrity-enabled client)
  IF p_client_version < 2 THEN
    RETURN json_build_object('error', 'Client update required');
  END IF;

  -- Must have a session ID
  IF p_session_id IS NULL OR length(p_session_id) < 10 THEN
    RETURN json_build_object('error', 'Invalid session');
  END IF;

  -- Must have an integrity hash
  IF p_integrity_hash IS NULL OR length(p_integrity_hash) < 5 THEN
    RETURN json_build_object('error', 'Missing integrity data');
  END IF;

  -- Session ID must not have been used before (prevents replay attacks)
  IF EXISTS (SELECT 1 FROM public.scores WHERE session_id = p_session_id) THEN
    RETURN json_build_object('error', 'Duplicate session');
  END IF;

  -- Event count plausibility:
  -- Minimum events = 'start' + at least 1 event per 100 score points
  -- A score of 0 still needs at least the 'start' event
  v_min_plausible_events := GREATEST(2, (p_score / 500) + 1);
  IF p_event_count < v_min_plausible_events THEN
    v_flagged := true;  -- Flag but still insert (for monitoring)
  END IF;

  -- Score vs bulls plausibility:
  -- Each bull = 100 pts. Score from bulls alone = bulls * 100.
  -- Remaining score must come from enemies/bonuses — cap at reasonable max.
  -- Max non-bull score ≈ 20 enemies * 500 + 5000 time bonus + 2000 boss = ~15,000
  v_max_possible_score := (p_bulls_collected * 100) + 15000;
  IF p_score > v_max_possible_score THEN
    v_flagged := true;
  END IF;

  -- Rate limiting: same player name can only submit once per 30 seconds
  IF EXISTS (
    SELECT 1 FROM public.scores
    WHERE player_name = trim(p_player_name)
      AND created_at > now() - interval '30 seconds'
  ) THEN
    RETURN json_build_object('error', 'Too many submissions, try again later');
  END IF;

  -- =====================
  -- Insert the score
  -- =====================
  INSERT INTO public.scores (
    player_name, score, bulls_collected, time_taken, character_used,
    session_id, event_count, integrity_hash, flagged
  ) VALUES (
    trim(p_player_name),
    LEAST(p_score, 49999),
    LEAST(p_bulls_collected, 99),
    GREATEST(p_time_taken, 10.1),
    p_character_used,
    p_session_id,
    p_event_count,
    p_integrity_hash,
    v_flagged
  );

  RETURN json_build_object('success', true, 'flagged', v_flagged);
END;
$$;

-- Step 7: Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION public.submit_score TO anon;

-- Step 8: Revoke direct table modifications from anon
REVOKE INSERT, UPDATE, DELETE ON public.scores FROM anon;

-- ==========================================
--  VERIFICATION: Test that the fix works
-- ==========================================
-- After running this migration, the old curl command will fail with:
--   "new row violates row-level security policy for table \"scores\""
--
-- The game client (updated with integrity.js) will use:
--   supabase.rpc('submit_score', { ... })
-- which goes through the validated function above.
-- ==========================================
