CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opening_id UUID NOT NULL REFERENCES openings(id) ON DELETE CASCADE,
  fen_before_move TEXT NOT NULL,
  move_played VARCHAR(10) NOT NULL,
  best_move VARCHAR(10) NOT NULL,
  move_quality VARCHAR(10) NOT NULL CHECK (move_quality IN ('best', 'acceptable', 'mistake')),
  attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attempts_user_opening ON attempts (user_id, opening_id);
