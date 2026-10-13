import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-paper px-6 py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-mist/30 text-sage">
          <Compass className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-normal text-sage">
            404 &middot; Not found
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink md:text-5xl">
            This canvas has moved
          </h1>
          <p className="mx-auto max-w-sm text-sm font-light leading-relaxed text-muted">
            The artwork or page you are seeking may have been archived into a private collection
            or relocated. Lisa&apos;s studio catalog is continuously in motion.
          </p>
        </div>

        <div className="pt-4">
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
