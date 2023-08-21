CREATE TABLE IF NOT EXISTS transfers(
  id INTEGER PRIMARY KEY,
  from_player INTEGER NOT NULL,
  to_player INTEGER NOT NULL,
  amount DECIMAL(24,10) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (to_player) REFERENCES players(id),
  FOREIGN KEY (from_player) REFERENCES players(id)
)