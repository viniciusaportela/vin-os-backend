CREATE TABLE IF NOT EXISTS minings_meta (
  lastProcessedBlock BIGINT NOT NULL DEFAULT 0,
  minedCoins DECIMAL(24,10) NOT NULL DEFAULT 0
);