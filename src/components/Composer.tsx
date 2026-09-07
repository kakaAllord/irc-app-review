"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/actions";
import { useToast } from "@/components/ui";

export default function Composer({ me, onDone }: { me: string; onDone?: () => void }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const notify = useToast();

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    start(async () => {
      const result = await addNote(me, body);
      if (result.ok) {
        setText("");
        notify("Note added");
        onDone?.();
      } else {
        notify(result.error);
      }
    });
  };

  return (
    <div>
      <h2 className="text-[15px] font-semibold">Your notes</h2>
      <p className="mt-0.5 mb-3.5 text-[13.5px] leading-snug text-ink-faint">
        Anything you would change, add or question. Everyone reviewing can read these.
      </p>
      <textarea
        id="composer"
        className="field min-h-32 bg-card text-[16.5px]"
        placeholder="Write your suggestion…"
        aria-label="Your suggestion"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        onClick={submit}
        disabled={pending || !text.trim()}
        className="mt-2.5 w-full rounded-lg bg-flame px-4 py-3 text-[16.5px] font-semibold text-card transition-colors hover:bg-flame-deep disabled:bg-ink-faint"
      >
        {pending ? "Saving…" : "Add note"}
      </button>
    </div>
  );
}
