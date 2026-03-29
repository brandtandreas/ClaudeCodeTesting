CREATE TABLE openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eco_code CHAR(3) NOT NULL,
  name VARCHAR(120) NOT NULL,
  color VARCHAR(5) NOT NULL CHECK (color IN ('white', 'black')),
  starting_fen TEXT NOT NULL,
  pgn_moves TEXT NOT NULL,
  move_count SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_openings_eco ON openings (eco_code);
