-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table for AI chat RAG
CREATE TABLE IF NOT EXISTS pjd_knowledge_base (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding
  ON pjd_knowledge_base USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

-- Full-text search index as fallback
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content
  ON pjd_knowledge_base USING gin (to_tsvector('english', content));

-- RLS: allow public read
ALTER TABLE pjd_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON pjd_knowledge_base FOR SELECT
  USING (true);

-- Chat sessions table for conversation history
CREATE TABLE IF NOT EXISTS pjd_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  messages JSONB DEFAULT '[]'::jsonb,
  lead_captured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pjd_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public chat access"
  ON pjd_chat_sessions FOR ALL
  USING (true);
