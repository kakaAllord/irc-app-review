-- IRCA review board schema.
-- Safe to run more than once.

create table if not exists notes (
  id         text primary key,
  author     text        not null,
  body       text        not null default '',
  kind       text        not null default 'note',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists replies (
  id         text primary key,
  note_id    text        not null references notes(id) on delete cascade,
  author     text        not null,
  body       text        not null,
  created_at timestamptz not null default now()
);

create index if not exists replies_note_id_idx on replies (note_id);
create index if not exists notes_created_at_idx on notes (created_at desc);

-- The pinned first round of suggestions. Its text lives in the app so it
-- renders as a proper list; this row exists so comments can hang off it.
insert into notes (id, author, body, kind, created_at, updated_at)
values ('allord-seed', 'Kaka Allord', '', 'seed', to_timestamp(0), to_timestamp(0))
on conflict (id) do nothing;
