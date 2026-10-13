'use client';

import React, { useEffect } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Palette, RefreshCw, ArrowRight } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error gracefully in non-production environments
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-paper px-6 py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-mist/30 text-sage">
          <Palette className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-normal text-sage">
            Studio notice
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink md:text-5xl">
            A quiet pause in the studio
          </h1>
          <p className="mx-auto max-w-sm text-sm font-light leading-relaxed text-muted">
            We encountered an unexpected moment while preparing this view. Please try refreshing
            the connection or return to the main gallery.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-sm border border-line bg-paper px-6 py-3 text-xs font-normal text-ink transition-colors hover:border-ink hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </button>

          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-xs font-normal text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            <span>Return to studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
