import React from 'react';

export default function PrintsLoading() {
  return (
    <div className="min-h-screen bg-paper pb-24 pt-28" aria-busy="true" aria-label="Loading prints gallery">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header Skeleton */}
        <div className="mb-12 border-b border-line pb-8">
          <div className="h-4 w-36 rounded bg-line/60 animate-pulse mb-3" />
          <div className="h-12 w-64 rounded bg-line/80 animate-pulse mb-4" />
          <div className="h-4 w-96 max-w-full rounded bg-line/50 animate-pulse" />
        </div>

        {/* Gallery Grid Skeleton */}
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
    </div>
  );
}
