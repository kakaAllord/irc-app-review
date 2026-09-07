"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const noDatabase = error.message.includes("DATABASE_URL");

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-10">
      <div className="w-full max-w-[27rem]">
        <h1 className="text-[clamp(2rem,8vw,2.75rem)] font-light leading-tight tracking-tight">
          The board is not answering.
        </h1>
        {noDatabase ? (
          <div className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
            <p>No database is configured yet. Add your Neon connection string as</p>
            <p className="my-2 rounded-lg border-[1.5px] border-line bg-card px-3 py-2 font-mono text-[14px] break-all">
              DATABASE_URL
            </p>
            <p>
              in <code className="text-[15px]">.env.local</code> when running locally, or in the
              project&rsquo;s environment variables when deployed, then reload.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
            Something went wrong reaching the database. Check your connection and try again.
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-flame px-5 py-3 text-[16.5px] font-semibold text-card transition-colors hover:bg-flame-deep"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
