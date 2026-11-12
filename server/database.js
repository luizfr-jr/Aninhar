import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateContent } from "./validation.js";

export function openDatabase({ dataDir, seedFile }) {
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(dataDir, "aninhar.sqlite"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY CHECK (id = 1), draft TEXT NOT NULL, published TEXT NOT NULL,
      version INTEGER NOT NULL, published_version INTEGER NOT NULL,
      updated_at TEXT NOT NULL, published_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, url TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      size INTEGER NOT NULL, mime_type TEXT NOT NULL, created_at TEXT NOT NULL);
  `);
  if (!db.prepare("SELECT id FROM documents WHERE id = 1").get()) {
    const seed = JSON.stringify(
      validateContent(JSON.parse(readFileSync(seedFile, "utf8"))),
    );
    const now = new Date().toISOString();
    db.prepare("INSERT INTO documents VALUES (1, ?, ?, 1, 1, ?, ?)").run(
      seed,
      seed,
      now,
      now,
    );
  }
  return db;
}

export function readDraft(db) {
  const row = db.prepare("SELECT * FROM documents WHERE id = 1").get();
  return {
    content: JSON.parse(row.draft),
    version: row.version,
    publishedVersion: row.published_version,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}
