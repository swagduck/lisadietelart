import React from 'react';

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-paper pb-24 pt-28" aria-busy="true" aria-label="Loading contact form">
      <div className="mx-auto max-w-4xl px-6 md:px-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-4 w-36 rounded bg-line/60 animate-pulse" />
          <div className="mx-auto h-12 w-80 max-w-full rounded bg-line/80 animate-pulse" />
        </div>
        <div className="mx-auto max-w-xl space-y-4">
          <div className="h-12 w-full rounded border border-line bg-mist/30 animate-pulse" />
          <div className="h-12 w-full rounded border border-line bg-mist/30 animate-pulse" />
          <div className="h-32 w-full rounded border border-line bg-mist/30 animate-pulse" />
          <div className="h-14 w-full rounded bg-line/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
