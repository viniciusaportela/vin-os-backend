CREATE TABLE IF NOT EXISTS minings(
  blockIndex INTEGER PRIMARY KEY NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
  computerId INTEGER NOT NULL,
  FOREIGN KEY (computerId) REFERENCES computers(id)
)