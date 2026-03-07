-- Enable pgvector extension
create extension if not exists vector;

-----------------------------------------------------------------------
-- SECTION A: PJD KNOWLEDGE BASE (documents_pjd)
-----------------------------------------------------------------------

-- Knowledge base table for AI chat RAG
create table public.documents_pjd (
  id bigserial not null,
  content text null,
  metadata jsonb null,
  embedding vector(1536) null,
  fts tsvector generated always as (to_tsvector('english'::regconfig, content)) stored null,
  constraint documents_pjd_pkey primary key (id)
) tablespace pg_default;

-- Full-text search index
create index if not exists documents_pjd_fts_idx
  on public.documents_pjd using gin (fts) tablespace pg_default;

-- Vector similarity index (HNSW for fast approximate search)
create index if not exists documents_pjd_embedding_idx
  on public.documents_pjd using hnsw (embedding vector_ip_ops)
  with (m = '16', ef_construction = '64') tablespace pg_default;

-- RLS: allow public read
alter table documents_pjd enable row level security;

create policy "Public read access"
  on documents_pjd for select
  using (true);

-----------------------------------------------------------------------
-- SECTION B: SEARCH FUNCTIONS
-----------------------------------------------------------------------

-- Hybrid search (vector + keyword with RRF scoring)
create or replace function hybrid_search_pjd(
  query_text text,
  query_embedding vector(1536),
  match_count int default 10,
  full_text_weight float default 1,
  semantic_weight float default 1,
  rrf_k int default 50,
  filter jsonb default '{}'
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float,
  fts_rank float,
  hybrid_score float
)
language sql
as $$
  with full_text as (
    select
      documents_pjd.id,
      row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix,
      ts_rank_cd(fts, websearch_to_tsquery(query_text)) as fts_score
    from documents_pjd
    where
      fts @@ websearch_to_tsquery(query_text)
      and metadata @> filter
    order by rank_ix
    limit least(match_count, 30) * 2
  ),
  semantic as (
    select
      documents_pjd.id,
      row_number() over (order by embedding <#> query_embedding) as rank_ix,
      1 - (documents_pjd.embedding <#> query_embedding) as semantic_score
    from documents_pjd
    where metadata @> filter
    order by rank_ix
    limit least(match_count, 30) * 2
  )
  select
    documents_pjd.id,
    documents_pjd.content,
    documents_pjd.metadata,
    coalesce(semantic.semantic_score, 0) as similarity,
    coalesce(full_text.fts_score, 0) as fts_rank,
    (coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
     coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight) as hybrid_score
  from full_text
  full outer join semantic on full_text.id = semantic.id
  join documents_pjd on coalesce(full_text.id, semantic.id) = documents_pjd.id
  order by hybrid_score desc
  limit least(match_count, 30)
$$;

-- Semantic-only search
create or replace function match_documents_pjd(
  query_embedding vector(1536),
  match_count int default null,
  filter jsonb default '{}'
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents_pjd.embedding <=> query_embedding) as similarity
  from documents_pjd
  where metadata @> filter
  order by documents_pjd.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Keyword-only search
create or replace function keyword_search_pjd(
  query_text text,
  match_count int default 10,
  filter jsonb default '{}'
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  rank float
)
language sql
as $$
  select
    id,
    content,
    metadata,
    ts_rank_cd(fts, websearch_to_tsquery(query_text)) as rank
  from documents_pjd
  where
    fts @@ websearch_to_tsquery(query_text)
    and metadata @> filter
  order by rank desc
  limit match_count
$$;

-- Hybrid search with detailed scoring breakdown
create or replace function hybrid_search_pjd_with_details(
  query_embedding vector(1536),
  query_text text,
  match_count int default 10,
  filter jsonb default '{}',
  rrf_k int default 60
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  vector_score float,
  keyword_score float,
  keyword_rank bigint,
  vector_rank bigint,
  combined_score float
)
language plpgsql
as $$
begin
  return query
  with vector_search as (
    select
      d.id,
      row_number() over (order by d.embedding <=> query_embedding) as rank_ix,
      1 - (d.embedding <=> query_embedding) as similarity_score
    from documents_pjd d
    where d.metadata @> filter
    order by d.embedding <=> query_embedding
    limit least(match_count, 30) * 2
  ),
  keyword_search as (
    select
      d.id,
      row_number() over(order by ts_rank_cd(d.fts, websearch_to_tsquery(query_text)) desc) as rank_ix,
      ts_rank_cd(d.fts, websearch_to_tsquery(query_text)) as rank_score
    from documents_pjd d
    where
      d.fts @@ websearch_to_tsquery(query_text)
      and d.metadata @> filter
    order by rank_score desc
    limit least(match_count, 30) * 2
  )
  select
    d.id,
    d.content,
    d.metadata,
    coalesce(vector_search.similarity_score, 0)::float as vector_score,
    coalesce(keyword_search.rank_score, 0)::float as keyword_score,
    keyword_search.rank_ix as keyword_rank,
    vector_search.rank_ix as vector_rank,
    (
      coalesce(1.0 / (rrf_k + vector_search.rank_ix), 0.0) +
      coalesce(1.0 / (rrf_k + keyword_search.rank_ix), 0.0)
    )::float as combined_score
  from keyword_search
  full outer join vector_search on keyword_search.id = vector_search.id
  join documents_pjd d on coalesce(keyword_search.id, vector_search.id) = d.id
  order by combined_score desc
  limit least(match_count, 30);
end;
$$;

-----------------------------------------------------------------------
-- SECTION C: RECORD MANAGER (for document tracking/deduplication)
-----------------------------------------------------------------------

create table public.record_manager_pjd (
  id bigint generated by default as identity not null,
  created_at timestamp with time zone not null default now(),
  doc_id text not null,
  hash text not null,
  constraint record_manager_pkey_pjd primary key (id)
) tablespace pg_default;

-----------------------------------------------------------------------
-- SECTION D: CHAT SESSIONS
-----------------------------------------------------------------------

create table if not exists pjd_chat_sessions (
  id uuid default gen_random_uuid() primary key,
  messages jsonb default '[]'::jsonb,
  lead_captured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pjd_chat_sessions enable row level security;

create policy "Public chat access"
  on pjd_chat_sessions for all
  using (true);
