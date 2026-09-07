"use client";

import { useState } from "react";
import { MOODS, PEOPLE } from "@/lib/people";

export default function Welcome({ onPick }: { onPick: (name: string, mood: string) => void }) {
  const [mood, setMood] = useState<{ key: string; echo: string } | null>(null);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-10">
      <div className="w-full max-w-[27rem]">
        {!mood ? (
          <div>
            <h1 className="text-[clamp(3rem,13vw,4.25rem)] font-light leading-[0.98] tracking-tight">
              <em className="not-italic font-semibold">Shalom.</em>
            </h1>
            <p className="mt-7 mb-4 text-[15px] text-ink-faint">How was your day?</p>
            <div className="flex flex-wrap gap-2.5">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m)}
                  className="rounded-full border-[1.5px] border-line px-5 py-2.5 transition-colors hover:border-ink hover:bg-white/50"
                >
                  {m.key}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-[clamp(2.25rem,9vw,3.25rem)] font-light leading-[1.02] tracking-tight">
              {mood.echo}
            </h1>
            <p className="mt-2 mb-7 text-xl font-light text-ink-soft">Who&rsquo;s reading?</p>

            <div className="border-t border-line">
              {PEOPLE.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onPick(p.name, mood.key)}
                  className="flex w-full items-center gap-3.5 border-b border-line py-4 text-left text-xl transition-[padding,color] duration-150 hover:pl-2 hover:text-flame"
                >
                  <span
                    aria-hidden
                    className="size-2.5 flex-none rounded-full"
                    style={{ backgroundColor: p.ink }}
                  />
                  {p.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMood(null)}
              className="mt-6 text-[15px] text-ink-faint underline underline-offset-4"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
