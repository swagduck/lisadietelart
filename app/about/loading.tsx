import React from 'react';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-paper pb-24 pt-28" aria-busy="true" aria-label="Loading artist bio">
      <div className="mx-auto max-w-5xl px-6 md:px-12 space-y-12">
        <div className="text-center space-y-3">
          <div className="mx-auto h-4 w-32 rounded bg-line/60 animate-pulse" />
          <div className="mx-auto h-12 w-64 rounded bg-line/80 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/5] rounded border border-line bg-mist/60 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 rounded bg-line/70 animate-pulse" />
            <div className="h-4 w-full rounded bg-line/40 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-line/40 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-line/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
