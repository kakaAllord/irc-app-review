# IRCA app — review

A small, private board where the review team reads what the IRCA registration app
does today and leaves notes and comments on it. Next.js App Router, Neon Postgres,
mobile first.

## Run it locally

```bash
npm install
cp .env.example .env.local     # then paste your Neon connection string
npm run dev
```

Open http://localhost:3000.

### The connection string

1. Create a project at [neon.tech](https://neon.tech).
2. In the project, click **Connect** and copy the **pooled** connection string
   (the host contains `-pooler`).
3. Put it in `.env.local`:

   ```
   DATABASE_URL="postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
   ```

The tables are created automatically the first time the app talks to the database,
so there is nothing else to run. If you would rather apply the schema by hand:

```bash
npm run db:setup      # applies db/schema.sql
```

## Deploy

Any host that runs Next.js works. On Vercel:

1. Push this folder to a Git repository.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is detected.
3. Add one environment variable, `DATABASE_URL`, with the Neon pooled string,
   for Production, Preview and Development.
4. Deploy.

Neon's serverless driver talks to Postgres over HTTP, so it works on Vercel's
serverless and edge runtimes without connection pooling headaches.

## How it is put together

| Path | What it holds |
| --- | --- |
| `src/app/page.tsx` | Server component; reads every note and hands them to the board |
| `src/app/actions.ts` | Server actions — add, edit, delete notes and comments |
| `src/lib/db.ts` | Neon client (created lazily) and the schema it ensures on first use |
| `src/lib/notes.ts` | The one read query, notes joined with their replies |
| `src/lib/people.ts` | The five reviewers and their ink colours |
| `src/lib/content.ts` | Static copy: current features, the pinned first-round suggestions |
| `src/components/` | Welcome flow, board, note cards, composer |
| `db/schema.sql` | The same schema as SQL, for `npm run db:setup` |

### Who is reading

There are no passwords. A reviewer picks their name on the welcome screen and it
is remembered in `localStorage`; that name is sent with each write and is what
lets you edit or delete your own notes. It keeps the board friendly for a group
of five people who all know each other — it is not a security boundary, so treat
the URL as the thing worth keeping private.

To change the list of reviewers, edit `PEOPLE` in `src/lib/people.ts`.
