'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global root error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f6f4] text-[#2b2a2e] flex items-center justify-center p-6 font-sans">
        <main className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#e3dfda] bg-[#dfe8e2]/40 text-[#5f7b6b]">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-normal text-[#5f7b6b]">
              Studio notice
            </span>
            <h1 className="text-3xl font-serif text-[#2b2a2e]">
              A quiet pause in the studio
            </h1>
            <p className="text-sm font-light leading-relaxed text-[#6f6c72]">
              An unexpected layout error occurred. You may try refreshing or returning to the gallery home.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 border border-[#e3dfda] bg-[#f7f6f4] px-6 py-3 text-xs text-[#2b2a2e] transition-colors hover:border-[#2b2a2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f7b6b]"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-[#2b2a2e] px-6 py-3 text-xs text-[#f7f6f4] transition-colors hover:bg-[#5f7b6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f7b6b]"
            >
              Return to gallery
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
