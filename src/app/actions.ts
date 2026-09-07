"use server";

import { revalidatePath } from "next/cache";
import { db, ensureSchema } from "@/lib/db";
import { isPerson } from "@/lib/people";
import type { ActionResult } from "@/lib/types";

const MAX_LENGTH = 4000;

function clean(text: unknown): string {
  return typeof text === "string" ? text.trim().slice(0, MAX_LENGTH) : "";
}

function guard(author: string, body: string): string | null {
  if (!isPerson(author)) return "We don't recognise that name — pick who you are again.";
  if (!body) return "Write something first.";
  return null;
}

function fail(err: unknown): ActionResult {
  console.error(err);
  return { ok: false, error: "Couldn't reach the board. Check your connection and try again." };
}

export async function addNote(author: string, text: string): Promise<ActionResult> {
  const body = clean(text);
  const problem = guard(author, body);
  if (problem) return { ok: false, error: problem };

  try {
    await ensureSchema();
    const sql = db();
    await sql`insert into notes (id, author, body, kind)
              values (${crypto.randomUUID()}, ${author}, ${body}, 'note')`;
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function editNote(author: string, id: string, text: string): Promise<ActionResult> {
  const body = clean(text);
  const problem = guard(author, body);
  if (problem) return { ok: false, error: problem };

  try {
    await ensureSchema();
    const sql = db();
    // author in the where clause: you can only edit your own notes.
    await sql`update notes
              set body = ${body}, updated_at = now()
              where id = ${id} and author = ${author} and kind = 'note'`;
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteNote(author: string, id: string): Promise<ActionResult> {
  if (!isPerson(author)) return { ok: false, error: "Pick who you are again." };

  try {
    await ensureSchema();
    const sql = db();
    await sql`delete from notes where id = ${id} and author = ${author} and kind = 'note'`;
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function addReply(author: string, noteId: string, text: string): Promise<ActionResult> {
  const body = clean(text);
  const problem = guard(author, body);
  if (problem) return { ok: false, error: problem };

  try {
    await ensureSchema();
    const sql = db();
    await sql`insert into replies (id, note_id, author, body)
              values (${crypto.randomUUID()}, ${noteId}, ${author}, ${body})`;
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteReply(author: string, id: string): Promise<ActionResult> {
  if (!isPerson(author)) return { ok: false, error: "Pick who you are again." };

  try {
    await ensureSchema();
    const sql = db();
    await sql`delete from replies where id = ${id} and author = ${author}`;
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}
