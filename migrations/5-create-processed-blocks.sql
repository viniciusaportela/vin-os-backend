CREATE TABLE IF NOT EXISTS processed_blocks(
  id INTEGER PRIMARY KEY,
  winner INTEGER NOT NULL,
  winnerIndex INTEGER NOT NULL,
  gainedCoins DECIMAL(24,10) NOT NULL,
  blockIndex INTEGER NOT NULL,
  processedAt TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (winner) REFERENCES computers(id)
)