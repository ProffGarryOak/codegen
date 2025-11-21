-- Create languages table
create table languages (
  id bigint primary key generated always as identity,
  name text not null,
  slug text not null unique
);

-- Create generations table
create table generations (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  code text not null,
  language_id bigint references languages(id) on delete cascade,
  created_at timestamptz default now()
);

-- Seed languages
insert into languages (name, slug) values
  ('Python', 'python'),
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('Java', 'java'),
  ('C++', 'cpp'),
  ('Go', 'go'),
  ('Rust', 'rust');
