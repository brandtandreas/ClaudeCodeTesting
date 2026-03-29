CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opening_id UUID NOT NULL REFERENCES openings(id) ON DELETE CASCADE,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  best_streak SMALLINT NOT NULL DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  mastered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, opening_id)
);
CREATE INDEX idx_user_progress_user ON user_progress (user_id);
