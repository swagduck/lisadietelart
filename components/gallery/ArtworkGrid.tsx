'use client';

import React, { useState } from 'react';
import { IArtwork, ArtworkCategory } from '@/types/artwork';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkModal } from './ArtworkModal';
import { cn } from '@/lib/utils';

interface ArtworkGridProps {
  artworks: IArtwork[];
  title?: string;
  subtitle?: string;
  initialCategory?: ArtworkCategory;
  showFilters?: boolean;
}

export function ArtworkGrid({
  artworks,
  title = 'Selected Paintings & Studies',
  subtitle = 'Curated Portfolio',
  initialCategory = 'All',
  showFilters = true,
}: ArtworkGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ArtworkCategory>(initialCategory);
  const [activeArtwork, setActiveArtwork] = useState<IArtwork | null>(null);

  const categories: ArtworkCategory[] = [
    'All',
    'Oil on Linen',
    'Watercolors',
    'Studies & Sketches',
  ];

  const filteredArtworks = artworks.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="works" className="border-b border-line bg-paper py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header & Filter Controls */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-sage">
              {subtitle}
            </span>
            <h2 className="font-heading text-4xl font-normal text-ink md:text-5xl">
              {title}
            </h2>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'border px-4 py-2 transition-all duration-200',
                    selectedCategory === cat
                      ? 'border-ink bg-ink font-medium text-paper'
                      : 'border-line bg-paper text-ink hover:border-ink'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onQuickView={(art) => setActiveArtwork(art)}
            />
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="border border-dashed border-line py-16 text-center text-sm text-muted">
            No works currently available under this category.
          </div>
        )}

        {/* Detailed Modal */}
        <ArtworkModal artwork={activeArtwork} onClose={() => setActiveArtwork(null)} />
      </div>
    </section>
  );
}

export default ArtworkGrid;
