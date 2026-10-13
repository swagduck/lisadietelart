import React from 'react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-paper" aria-busy="true" aria-label="Loading studio home">
      {/* Hero Skeleton with full-screen dimensions */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink/90 flex flex-col justify-end px-6 pb-24 md:px-12 md:pb-32">
        <div className="max-w-2xl space-y-6">
          <div className="h-6 w-36 rounded-full bg-white/10 animate-pulse" />
          <div className="h-14 sm:h-20 w-3/4 rounded-lg bg-white/15 animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-white/10 animate-pulse" />
          <div className="flex gap-4 pt-2">
            <div className="h-11 w-36 rounded-sm bg-white/20 animate-pulse" />
            <div className="h-11 w-36 rounded-sm bg-white/10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Selected Work Full-Bleed Slider Skeleton */}
      <section
        className="w-full overflow-x-clip py-16 md:py-24 space-y-10"
        style={{ paddingInline: 'clamp(16px, 4vw, 56px)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 sm:h-12 w-64 rounded bg-line/80 animate-pulse" />
            <div className="h-4 w-80 rounded bg-line/50 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded bg-line/60 animate-pulse" />
        </div>

        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 aspect-[4/5] w-[280px] sm:w-[320px] rounded-sm bg-mist/40 animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
