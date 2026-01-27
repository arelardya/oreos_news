-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT NULL,
  content TEXT NOT NULL,
  image VARCHAR(1000) NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100) NULL,
  author VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'published',
  scheduled_publish_at TIMESTAMP NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Crossword games table (for your future feature!)
CREATE TABLE IF NOT EXISTS crossword_games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  grid_data JSONB NOT NULL,
  clues_across JSONB NOT NULL,
  clues_down JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP NULL,
  play_count INTEGER NOT NULL DEFAULT 0,
  completion_count INTEGER NOT NULL DEFAULT 0
);

-- Crossword scores table (for leaderboard)
CREATE TABLE IF NOT EXISTS crossword_scores (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES crossword_games(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  completion_time INTEGER NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crossword_scores_game_id ON crossword_scores(game_id);
CREATE INDEX IF NOT EXISTS idx_crossword_scores_score ON crossword_scores(score DESC);

-- Gallery photos table (for individual photo uploads)
CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(1000) NOT NULL,
  uploaded_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_uploaded_by ON gallery_photos(uploaded_by);

-- Crossword word bank table (for Ghalyndra to add words)
CREATE TABLE IF NOT EXISTS crossword_words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(50) NOT NULL,
  clue TEXT NOT NULL,
  category VARCHAR(100) NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  times_used INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_crossword_words_difficulty ON crossword_words(difficulty);
CREATE INDEX IF NOT EXISTS idx_crossword_words_category ON crossword_words(category);