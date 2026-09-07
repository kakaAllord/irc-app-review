"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/* ---------- toast ---------- */

const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2800);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4"
      >
        {message ? (
          <span className="max-w-full rounded-full bg-ink px-5 py-2.5 text-[15px] text-card shadow-lg">
            {message}
          </span>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- collapsible section ---------- */

export function Collapsible({
  title,
  note,
  defaultOpen = false,
  children,
}: {
  title: string;
  note: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-start gap-3 border-b border-line pb-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold tracking-wide transition-colors group-hover:text-flame">
            {title}
          </span>
          <span className="mt-0.5 block text-[13.5px] text-ink-faint">{note}</span>
        </span>
        <span
          aria-hidden
          className={`mt-1.5 size-3 flex-none border-b-2 border-r-2 border-ink-faint transition-transform duration-200 ${
            open ? "rotate-[-135deg]" : "rotate-[45deg]"
          }`}
        />
      </button>
      {open ? <div className="pt-5">{children}</div> : null}
    </section>
  );
}

/* ---------- avatar ---------- */

export function Avatar({ name, ink, initials }: { name: string; ink: string; initials: string }) {
  return (
    <span
      aria-hidden
      title={name}
      className="grid size-8 flex-none place-items-center rounded-full text-[12.5px] font-semibold text-card"
      style={{ backgroundColor: ink }}
    >
      {initials}
    </span>
  );
}
