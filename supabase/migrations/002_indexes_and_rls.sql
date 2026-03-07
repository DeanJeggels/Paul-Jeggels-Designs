-- Add GIN index on documents_pjd.metadata for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_documents_pjd_metadata
  ON documents_pjd USING gin (metadata);

-- Tighten RLS on pjd_chat_sessions
-- Allow public SELECT and INSERT, restrict UPDATE/DELETE to authenticated users
ALTER TABLE pjd_chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON pjd_chat_sessions;
CREATE POLICY "Allow public read"
  ON pjd_chat_sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON pjd_chat_sessions;
CREATE POLICY "Allow public insert"
  ON pjd_chat_sessions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON pjd_chat_sessions;
CREATE POLICY "Allow authenticated update"
  ON pjd_chat_sessions FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete" ON pjd_chat_sessions;
CREATE POLICY "Allow authenticated delete"
  ON pjd_chat_sessions FOR DELETE
  USING (auth.role() = 'authenticated');
