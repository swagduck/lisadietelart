import React from 'react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-paper" aria-busy="true" aria-label="Loading studio home">
      {/* Hero Skeleton */}
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

      {/* Selected Work Grid Skeleton */}
      <section className="border-b border-line bg-paper px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-line/60 animate-pulse" />
              <div className="h-10 w-56 rounded bg-line/80 animate-pulse" />
            </div>
            <div className="h-4 w-44 rounded bg-line/60 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-line bg-paper p-3 shadow-sm">
                <div className="aspect-[3/4] w-full rounded-sm bg-mist/60 animate-pulse" />
                <div className="mt-4 space-y-2 px-1">
                  <div className="h-6 w-3/4 rounded bg-line/80 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-line/50 animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-line/40 animate-pulse" />
                  <div className="flex justify-between border-t border-line/60 pt-3">
                    <div className="h-4 w-20 rounded bg-line/60 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-line/40 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
