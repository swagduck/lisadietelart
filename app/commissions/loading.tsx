import React from 'react';

export default function CommissionsLoading() {
  return (
    <div className="min-h-screen bg-paper pb-24 pt-28" aria-busy="true" aria-label="Loading bespoke commissions page">
      <div className="mx-auto max-w-4xl px-6 md:px-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-4 w-36 rounded bg-line/60 animate-pulse" />
          <div className="mx-auto h-12 w-80 max-w-full rounded bg-line/80 animate-pulse" />
          <div className="mx-auto h-4 w-96 max-w-full rounded bg-line/50 animate-pulse" />
        </div>
        <div className="border border-line bg-mist/20 p-8 rounded space-y-4">
          <div className="h-6 w-48 rounded bg-line/70 animate-pulse" />
          <div className="h-4 w-full rounded bg-line/40 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-line/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
