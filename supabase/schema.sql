create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  portrait_url text,
  origin text,
  class_name text,
  nex integer not null default 5,
  age integer,
  height numeric,
  weight numeric,
  appearance text,
  personality text,
  background text,
  goals text,
  notes text,
  attributes jsonb not null default '{"FOR":1,"AGI":1,"INT":1,"PRE":1,"VIG":1}'::jsonb,
  hp_current integer not null default 0,
  hp_max integer not null default 0,
  pe_current integer not null default 0,
  pe_max integer not null default 0,
  san_current integer not null default 0,
  san_max integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  cover_url text,
  invite_code text unique not null default encode(gen_random_bytes(8),'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'player' check (role in ('gm','player')),
  character_id uuid references public.characters(id) on delete set null,
  joined_at timestamptz not null default now(),
  primary key (campaign_id,user_id)
);

create table if not exists public.session_logs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.session_logs enable row level security;

create policy "profiles own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "characters own" on public.characters for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "campaign owners" on public.campaigns for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "campaign members read" on public.campaign_members for select using (auth.uid() = user_id);
create policy "campaign members insert" on public.campaign_members for insert with check (auth.uid() = user_id);
create policy "session logs members" on public.session_logs for select using (
  exists (select 1 from public.campaign_members m where m.campaign_id = session_logs.campaign_id and m.user_id = auth.uid())
);
create policy "session logs gm" on public.session_logs for all using (
  exists (select 1 from public.campaigns c where c.id = session_logs.campaign_id and c.owner_id = auth.uid())
) with check (
  exists (select 1 from public.campaigns c where c.id = session_logs.campaign_id and c.owner_id = auth.uid())
);
alter table public.characters add column if not exists skills jsonb not null default '[]'::jsonb;
alter table public.characters add column if not exists inventory jsonb not null default '[]'::jsonb;
alter table public.characters add column if not exists weapons jsonb not null default '[]'::jsonb;
alter table public.characters add column if not exists conditions jsonb not null default '[]'::jsonb;
