import React from 'react';

export default function ArtworkDetailLoading() {
  return (
    <div className="min-h-screen bg-paper pb-24 pt-28" aria-busy="true" aria-label="Loading artwork details">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <div className="h-4 w-32 rounded bg-line/60 animate-pulse" />
        </div>

        {/* Presentation Grid Skeleton */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Large Image Skeleton */}
          <div className="space-y-4 lg:col-span-7">
            <div className="border border-line bg-paper p-3 shadow-md">
              <div className="aspect-[4/5] w-full rounded-sm bg-mist/60 animate-pulse" />
            </div>
            <div className="flex justify-between pt-1">
              <div className="h-3 w-40 rounded bg-line/40 animate-pulse" />
              <div className="h-3 w-36 rounded bg-line/40 animate-pulse" />
            </div>
          </div>

          {/* Right Column: Metadata Skeleton */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded bg-line/60 animate-pulse" />
              <div className="h-12 w-3/4 rounded bg-line/80 animate-pulse" />
              <div className="h-8 w-32 rounded bg-line/60 animate-pulse pt-2" />
            </div>

            {/* Specifications Table Skeleton */}
            <div className="space-y-3 border-y border-line py-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <div className="h-4 w-16 rounded bg-line/50 animate-pulse" />
                  <div className="col-span-2 h-4 w-40 rounded bg-line/60 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-line/40 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-line/40 animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-line/40 animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="h-14 w-full rounded-sm bg-line/80 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
