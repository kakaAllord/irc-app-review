import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/**
 * The Neon client, created on first use. Lazy on purpose: the connection
 * string is only needed to serve a request, so a build with no env vars set
 * still succeeds.
 */
export function db(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Copy .env.example to .env.local and paste your Neon connection string."
      );
    }
    client = neon(url);
  }
  return client;
}

/** Statements that make up the schema, in order. Mirrors db/schema.sql. */
const SCHEMA = [
  `create table if not exists notes (
     id         text primary key,
     author     text        not null,
     body       text        not null default '',
     kind       text        not null default 'note',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   )`,
  `create table if not exists replies (
     id         text primary key,
     note_id    text        not null references notes(id) on delete cascade,
     author     text        not null,
     body       text        not null,
     created_at timestamptz not null default now()
   )`,
  `create index if not exists replies_note_id_idx on replies (note_id)`,
  `create index if not exists notes_created_at_idx on notes (created_at desc)`,
  `insert into notes (id, author, body, kind, created_at, updated_at)
   values ('allord-seed', 'Kaka Allord', '', 'seed', to_timestamp(0), to_timestamp(0))
   on conflict (id) do nothing`,
];

let ready: Promise<void> | null = null;

/**
 * Creates the tables on first use, so a fresh Neon database works with nothing
 * but a connection string. Runs once per server instance.
 */
export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const sql = db();
      for (const statement of SCHEMA) {
        await sql.query(statement);
      }
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}
