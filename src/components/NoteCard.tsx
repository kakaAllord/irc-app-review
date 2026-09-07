"use client";

import { useState, useTransition } from "react";
import { addReply, deleteNote, deleteReply, editNote } from "@/app/actions";
import { SEED_ITEMS } from "@/lib/content";
import { when } from "@/lib/format";
import { inkOf, initialsOf } from "@/lib/people";
import type { ActionResult, Note } from "@/lib/types";
import { Avatar, useToast } from "@/components/ui";

/** Renders **bold** spans inside the seed suggestions. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SeedBody({ isMine }: { isMine: boolean }) {
  return (
    <div>
      <span className="mb-3 inline-block rounded-full border border-olive/40 px-3 py-0.5 text-[12.5px] text-olive">
        First round
      </span>
      <ul className="ml-5 list-disc space-y-2.5 text-[16.5px] leading-relaxed">
        {SEED_ITEMS.map((item, i) => (
          <li key={i}>
            <RichText text={item.text} />
            {item.sub ? (
              <ul className="mt-1.5 ml-4 list-[circle] space-y-1 text-[15.5px] text-ink-soft">
                {item.sub.map((sub, j) => (
                  <li key={j}>{sub}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
      {isMine ? (
        <p className="mt-4 text-[13px] italic text-ink-faint">
          These are your earlier suggestions. They stay fixed here &mdash; add anything new as a note.
        </p>
      ) : null}
    </div>
  );
}

export default function NoteCard({ note, me }: { note: Note; me: string }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.body);
  const [pending, start] = useTransition();
  const notify = useToast();

  const ink = inkOf(note.author);
  const isSeed = note.kind === "seed";
  const isMine = note.author === me;
  const edited = !isSeed && note.updatedAt !== note.createdAt;

  const run = (task: () => Promise<ActionResult>, done: string, after?: () => void) =>
    start(async () => {
      const result = await task();
      if (result.ok) {
        notify(done);
        after?.();
      } else {
        notify(result.error);
      }
    });

  return (
    <article
      className="mb-3.5 rounded-card border-l-4 bg-card px-4 py-4 shadow-[0_1px_0_rgba(38,34,25,0.08),0_10px_20px_-16px_rgba(38,34,25,0.55)] sm:px-5"
      style={{ borderLeftColor: ink }}
    >
      <header className="mb-2.5 flex items-center gap-2.5">
        <Avatar name={note.author} ink={ink} initials={initialsOf(note.author)} />
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-semibold" style={{ color: ink }}>
            {note.author}
          </div>
          <div className="text-[12px] text-ink-faint">
            {isSeed ? "earlier" : when(note.updatedAt)}
            {edited ? " · edited" : ""}
          </div>
        </div>
      </header>

      {isSeed ? (
        <SeedBody isMine={isMine} />
      ) : editing ? (
        <div>
          <textarea
            className="field min-h-28 text-[16px]"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            aria-label="Edit your note"
          />
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              disabled={pending || !editText.trim()}
              onClick={() =>
                run(() => editNote(me, note.id, editText), "Changes saved", () => setEditing(false))
              }
              className="rounded-lg bg-ink px-4 py-2 text-[14.5px] font-semibold text-card disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setEditText(note.body);
              }}
              className="px-2 text-[14px] text-ink-faint underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-[16.5px] leading-relaxed">{note.body}</p>
      )}

      {note.replies.length > 0 ? (
        <div className="mt-3.5 space-y-2.5 border-t border-line pt-3">
          {note.replies.map((reply) => {
            const replyInk = inkOf(reply.author);
            return (
              <div
                key={reply.id}
                className="border-l-2 py-1 pl-3"
                style={{ borderLeftColor: replyInk }}
              >
                <div className="flex items-baseline gap-2 text-[12.5px]">
                  <span className="font-semibold" style={{ color: replyInk }}>
                    {reply.author}
                  </span>
                  <span className="text-ink-faint">{when(reply.createdAt)}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-[15.5px] leading-normal">
                  {reply.body}
                </p>
                {reply.author === me ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => deleteReply(me, reply.id), "Comment deleted")}
                    className="mt-1 text-[12.5px] text-ink-faint underline underline-offset-4 hover:text-flame"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {replying ? (
        <div className="mt-3">
          <textarea
            autoFocus
            className="field min-h-20 text-[15.5px]"
            placeholder="Comment on this…"
            aria-label="Your comment"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending || !replyText.trim()}
              onClick={() =>
                run(() => addReply(me, note.id, replyText), "Comment posted", () => {
                  setReplyText("");
                  setReplying(false);
                })
              }
              className="rounded-lg bg-ink px-4 py-2 text-[14.5px] font-semibold text-card disabled:opacity-50"
            >
              {pending ? "Posting…" : "Post comment"}
            </button>
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="px-2 text-[14px] text-ink-faint underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-4 text-[13.5px] text-ink-faint">
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="underline underline-offset-4 hover:text-flame"
          >
            {note.replies.length ? "Add a comment" : "Comment"}
          </button>
          {isMine && !isSeed ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="underline underline-offset-4 hover:text-flame"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm("Delete this note?")) {
                    run(() => deleteNote(me, note.id), "Note deleted");
                  }
                }}
                className="underline underline-offset-4 hover:text-flame"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      )}
    </article>
  );
}
