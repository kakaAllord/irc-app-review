/**
 * Server-rendered fallback for when the database cannot be reached — most
 * often because DATABASE_URL has not been set yet on a fresh deploy.
 */
export default function SetupNotice({ missingUrl }: { missingUrl: boolean }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-10">
      <div className="w-full max-w-[30rem]">
        <h1 className="text-[clamp(2rem,8vw,2.75rem)] font-light leading-tight tracking-tight">
          {missingUrl ? "Almost there." : "The board is not answering."}
        </h1>

        {missingUrl ? (
          <div className="mt-4 space-y-3 text-[16.5px] leading-relaxed text-ink-soft">
            <p>This board needs a Neon Postgres database. Two steps:</p>
            <ol className="ml-5 list-decimal space-y-2">
              <li>
                In your Neon project, open <strong className="font-semibold">Connect</strong> and
                copy the pooled connection string.
              </li>
              <li>
                Set it as <code className="text-[15px] font-semibold">DATABASE_URL</code> — in{" "}
                <code className="text-[15px]">.env.local</code> when running locally, or in your
                host&rsquo;s environment variables when deployed — then reload.
              </li>
            </ol>
            <p className="rounded-lg border-[1.5px] border-line bg-card px-3.5 py-2.5 font-mono text-[13px] break-all text-ink-faint">
              DATABASE_URL=&quot;postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&quot;
            </p>
            <p className="text-[15px] text-ink-faint">
              The tables create themselves the first time the app connects.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
            The database is configured but did not answer. Check that the connection string is
            current and that the Neon project is not suspended, then reload.
          </p>
        )}
      </div>
    </main>
  );
}
