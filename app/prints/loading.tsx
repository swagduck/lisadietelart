import React from 'react';

export default function PrintsLoading() {
  return (
    <div
      className="min-h-screen bg-paper pt-24"
      aria-busy="true"
      aria-label="Loading art prints gallery"
    >
      {/* Editorial Header Skeleton */}
      <section
        className="border-b border-line bg-mist/20 py-16"
        style={{ paddingInline: 'var(--gutter)' }}
      >
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <div className="mx-auto h-3 w-36 rounded bg-line/60 animate-pulse" />
          <div className="mx-auto h-12 w-80 rounded bg-line/80 animate-pulse" />
          <div className="mx-auto h-4 w-96 max-w-full rounded bg-line/50 animate-pulse" />
        </div>
      </section>

      {/* Gallery Grid Skeleton */}
      <section
        className="py-16 md:py-24"
        style={{ paddingInline: 'var(--gutter)' }}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-full space-y-3">
              <div className="aspect-[4/5] w-full rounded-sm bg-mist/50 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-line/60 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
