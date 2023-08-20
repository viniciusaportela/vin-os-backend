CREATE TABLE IF NOT EXISTS computers (
  id INTEGER PRIMARY KEY,
  owner INTEGER NOT NULL,
  type VARCHAR(255),
  status VARCHAR(255) NOT NULL DEFAULT 'active',
  createdAt TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (owner) REFERENCES players(id)
);