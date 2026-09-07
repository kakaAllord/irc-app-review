import { db, ensureSchema } from "@/lib/db";
import type { Note, Reply } from "@/lib/types";

type NoteRow = {
  id: string;
  author: string;
  body: string;
  kind: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type ReplyRow = {
  id: string;
  note_id: string;
  author: string;
  body: string;
  created_at: Date | string;
};

const iso = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

/** Every note, newest first, with the pinned seed note always on top. */
export async function getNotes(): Promise<Note[]> {
  await ensureSchema();
  const sql = db();

  const [noteResult, replyResult] = await Promise.all([
    sql`select id, author, body, kind, created_at, updated_at
        from notes
        order by (kind = 'seed') desc, created_at desc`,
    sql`select id, note_id, author, body, created_at
        from replies
        order by created_at asc`,
  ]);

  const noteRows = noteResult as unknown as NoteRow[];
  const replyRows = replyResult as unknown as ReplyRow[];

  const repliesByNote = new Map<string, Reply[]>();
  for (const row of replyRows) {
    const reply: Reply = {
      id: row.id,
      noteId: row.note_id,
      author: row.author,
      body: row.body,
      createdAt: iso(row.created_at),
    };
    const bucket = repliesByNote.get(row.note_id);
    if (bucket) bucket.push(reply);
    else repliesByNote.set(row.note_id, [reply]);
  }

  return noteRows.map((row) => ({
    id: row.id,
    author: row.author,
    body: row.body,
    kind: row.kind === "seed" ? "seed" : "note",
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    replies: repliesByNote.get(row.id) ?? [],
  }));
}
