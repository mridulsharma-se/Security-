-- VibeGuard initial schema
create extension if not exists "vector";
create extension if not exists "pgcrypto";

create table public.repositories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  github_repo_id bigint not null unique,
  full_name text not null,
  default_branch text not null default 'main',
  installation_id bigint not null,
  scan_enabled boolean not null default true,
  last_scanned_sha text,
  created_at timestamptz not null default now()
);

create type vuln_severity as enum ('critical','high','medium','low','info');
create type vuln_category as enum (
  'idor','broken_access_control','rls_misconfiguration',
  'missing_input_validation','sql_injection','ssrf','xss','secret_exposure'
);
create type fix_status as enum ('detected','fix_proposed','pr_open','merged','dismissed','failed');

create table public.vulnerabilities (
  id uuid primary key default gen_random_uuid(),
  repository_id uuid not null references public.repositories(id) on delete cascade,
  commit_sha text not null,
  file_path text not null,
  line_start int,
  line_end int,
  category vuln_category not null,
  severity vuln_severity not null,
  title text not null,
  exploit_narrative text not null,
  proof_of_concept text,
  cwe text,
  status fix_status not null default 'detected',
  detected_by text not null default 'attacker_agent_v1',
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index vulnerabilities_embedding_idx on public.vulnerabilities
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table public.fix_attempts (
  id uuid primary key default gen_random_uuid(),
  vulnerability_id uuid not null references public.vulnerabilities(id) on delete cascade,
  branch_name text not null,
  pr_number int,
  pr_url text,
  diff text not null,
  fix_narrative text not null,
  model text not null,
  tokens_used int,
  status fix_status not null default 'fix_proposed',
  created_at timestamptz not null default now()
);

-- pgvector similarity RPC for dedup
create or replace function public.match_vulnerabilities(
  query_embedding vector(1536),
  repo_id uuid,
  match_threshold float,
  match_count int
) returns table (id uuid, similarity float)
language sql stable as $$
  select v.id,
         1 - (v.embedding <=> query_embedding) as similarity
  from public.vulnerabilities v
  where v.repository_id = repo_id
    and v.embedding is not null
    and 1 - (v.embedding <=> query_embedding) > match_threshold
  order by v.embedding <=> query_embedding
  limit match_count;
$$;

-- RLS
alter table public.repositories enable row level security;
alter table public.vulnerabilities enable row level security;
alter table public.fix_attempts enable row level security;

create policy "owner reads repos" on public.repositories
  for select using (auth.uid() = owner_id);

create policy "owner reads vulns" on public.vulnerabilities
  for select using (
    exists (select 1 from public.repositories r
            where r.id = repository_id and r.owner_id = auth.uid())
  );

create policy "owner reads fixes" on public.fix_attempts
  for select using (
    exists (select 1 from public.vulnerabilities v
            join public.repositories r on r.id = v.repository_id
            where v.id = vulnerability_id and r.owner_id = auth.uid())
  );
