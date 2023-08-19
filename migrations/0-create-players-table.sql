CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  name,
  coins REAL NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);