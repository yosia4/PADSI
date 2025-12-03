import { query } from "./db";

let visitsImportedAtEnsured = false;

export async function ensureVisitsImportedAtColumn() {
  if (visitsImportedAtEnsured) return;
  await query(
    "ALTER TABLE visits ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ NOT NULL DEFAULT now()"
  );
  visitsImportedAtEnsured = true;
}
