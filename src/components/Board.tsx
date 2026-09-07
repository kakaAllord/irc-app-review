"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Composer from "@/components/Composer";
import NoteCard from "@/components/NoteCard";
import Welcome from "@/components/Welcome";
import { Avatar, Collapsible, ToastProvider } from "@/components/ui";
import { APP_URL, CURRENT_FEATURES } from "@/lib/content";
import { inkOf, initialsOf, isPerson } from "@/lib/people";
import type { Note } from "@/lib/types";

const ME_KEY = "irca-review:me";
const REFRESH_MS = 30000;

export default function Board({ notes }: { notes: Note[] }) {
  const [me, setMe] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ME_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { name?: unknown };
        if (isPerson(parsed.name)) setMe(parsed.name);
      }
    } catch {
      // ignore unreadable storage
    }
    setReady(true);
  }, []);

  // Keep the board fresh while someone has it open.
  useEffect(() => {
    if (!me) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [me, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = useCallback(
    (name: string, mood: string) => {
      try {
        localStorage.setItem(ME_KEY, JSON.stringify({ name, mood }));
      } catch {
        // ignore unwritable storage
      }
      setMe(name);
      router.refresh();
    },
    [router]
  );

  const switchUser = useCallback(() => {
    try {
      localStorage.removeItem(ME_KEY);
    } catch {
      // ignore
    }
    setMe(null);
    setSheetOpen(false);
  }, []);

  if (!ready) return <div className="min-h-dvh" aria-hidden />;

  return (
    <ToastProvider>
      {!me ? (
        <Welcome onPick={pick} />
      ) : (
        <div className="mx-auto max-w-[1180px] px-5 pb-32 lg:px-6 lg:pb-16">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-2 border-ink pt-6 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              IRCA app <span className="font-light text-ink-faint">&mdash; review</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[1.5px] border-flame/40 pb-px text-flame transition-colors hover:border-flame"
              >
                Open the app
              </a>
              <span className="flex items-center gap-2 text-ink-soft">
                <Avatar name={me} ink={inkOf(me)} initials={initialsOf(me)} />
                <span className="font-semibold" style={{ color: inkOf(me) }}>
                  {me}
                </span>
              </span>
              <button
                type="button"
                onClick={switchUser}
                className="text-ink-faint underline underline-offset-4"
              >
                Not you?
              </button>
            </div>
          </header>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <main className="min-w-0">
              <Collapsible title="What the app does now" note="The features already built.">
                <div className="border-l-2 border-olive pl-4">
                  {CURRENT_FEATURES.map((group) => (
                    <div key={group.title} className="mb-5 last:mb-0">
                      <h3 className="mb-2 text-[15px] font-semibold text-olive">{group.title}</h3>
                      <ul className="ml-4 list-disc space-y-1 text-[15.5px] text-ink-soft">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Collapsible>

              <Collapsible
                title="Reviews and suggestions"
                note={`${notes.length} ${notes.length === 1 ? "note" : "notes"} on the board.`}
              >
                {notes.length === 0 ? (
                  <p className="rounded-card border-[1.5px] border-dashed border-line px-5 py-7 text-center text-ink-faint">
                    No notes yet. Yours would be the first.
                  </p>
                ) : (
                  notes.map((note) => <NoteCard key={note.id} note={note} me={me} />)
                )}
              </Collapsible>
            </main>

            {/* Desktop: sticky side panel. Mobile: bottom sheet. */}
            <aside className="hidden lg:sticky lg:top-6 lg:block">
              <Composer me={me} />
            </aside>
          </div>

          {/* ---- mobile composer ---- */}
          <button
            type="button"
            aria-label="Write a note"
            onClick={() => setSheetOpen(true)}
            className={`fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[35] grid size-14 place-items-center rounded-full bg-flame shadow-lg lg:hidden ${
              sheetOpen ? "hidden" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-card stroke-[1.7]" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>

          {sheetOpen ? (
            <div
              className="fixed inset-0 z-[38] bg-ink/45 lg:hidden"
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />
          ) : null}

          <div
            className={`fixed inset-x-0 bottom-0 z-[40] max-h-[88dvh] overflow-y-auto rounded-t-2xl border-t-2 border-ink bg-paper-deep px-5 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_34px_-18px_rgba(38,34,25,0.75)] transition-transform duration-300 ease-out lg:hidden ${
              sheetOpen ? "translate-y-0" : "translate-y-full"
            }`}
            role="dialog"
            aria-label="Write a note"
            aria-hidden={!sheetOpen}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="text-[15px] text-ink-faint underline underline-offset-4"
              >
                Close
              </button>
            </div>
            <Composer me={me} onDone={() => setSheetOpen(false)} />
          </div>
        </div>
      )}
    </ToastProvider>
  );
}
