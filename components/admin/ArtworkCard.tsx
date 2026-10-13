'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { Star, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface ArtworkCardProps {
  artwork: IArtwork;
  onDelete: (slug: string) => Promise<void>;
  onToggleSold: (slug: string, currentSold: boolean) => Promise<void>;
  onToggleFeatured: (slug: string, currentFeatured: boolean) => Promise<void>;
}

export function ArtworkCard({
  artwork,
  onDelete,
  onToggleSold,
  onToggleFeatured,
}: ArtworkCardProps) {
  const [togglingSold, setTogglingSold] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const displayImage =
    artwork.imageUrl ||
    (artwork.images && artwork.images.length > 0 ? artwork.images[0] : null) ||
    '/images/nocturne-in-ochre.svg';

  const isSold = Boolean(artwork.sold || artwork.isSoldOut);
  const isFeatured = Boolean(artwork.featured);
  const artworkIdentifier = artwork.slug || artwork.id || artwork._id || '';

  const handleSoldClick = async () => {
    if (togglingSold) return;
    try {
      setTogglingSold(true);
      await onToggleSold(artwork.slug, isSold);
    } finally {
      setTogglingSold(false);
    }
  };

  const handleFeaturedClick = async () => {
    if (togglingFeatured) return;
    try {
      setTogglingFeatured(true);
      await onToggleFeatured(artwork.slug, isFeatured);
    } finally {
      setTogglingFeatured(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await onDelete(artwork.slug);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-line p-4 sm:p-5 shadow-sm transition-all hover:border-sage/40 flex flex-col gap-4">
      {/* Top Section: Thumbnail & Core Details */}
      <div className="flex gap-4 items-start">
        {/* Thumbnail Preview */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-paper shrink-0 border border-line/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={artwork.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/nocturne-in-ochre.svg';
            }}
          />
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
            {artwork.type && (
              <span
                className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shadow-sm ${
                  artwork.type === 'original'
                    ? 'bg-ink/90 text-paper'
                    : 'bg-sage/90 text-white'
                }`}
              >
                {artwork.type}
              </span>
            )}
            {artwork.showInHero && (
              <span className="bg-sage/90 text-white text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded shadow-sm">
                Hero
              </span>
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-heading text-lg sm:text-xl font-normal text-ink truncate leading-tight">
              {artwork.title}
            </h3>
          </div>

          <p className="text-xs text-muted truncate mt-0.5">
            {artwork.medium || 'Medium unspecified'}
          </p>

          <p className="text-xs text-muted/80 truncate mt-0.5">
            {artwork.size || artwork.dimensions || 'Size unspecified'}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-base sm:text-lg font-medium text-ink">
              {formatPrice(artwork.price, artwork.currency || 'USD')}
            </span>
            <span className="text-[10px] text-muted uppercase font-mono">
              {artwork.currency || 'USD'}
            </span>
          </div>
        </div>
      </div>

      {/* Instant Action Toggles (Phone-friendly touch buttons) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line/60">
        {/* Sold Toggle */}
        <button
          type="button"
          onClick={handleSoldClick}
          disabled={togglingSold}
          aria-label={`Toggle sold state. Currently ${isSold ? 'Sold' : 'Available'}`}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border active:scale-[0.98] ${
            isSold
              ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              : 'bg-sage/15 text-sage hover:bg-sage/20 border-sage/30'
          }`}
        >
          {togglingSold ? (
            <span className="animate-pulse">Updating...</span>
          ) : isSold ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              <span>Sold out</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-sage inline-block" />
              <span>Available</span>
            </>
          )}
        </button>

        {/* Featured Toggle */}
        <button
          type="button"
          onClick={handleFeaturedClick}
          disabled={togglingFeatured}
          aria-label={`Toggle featured state. Currently ${isFeatured ? 'Featured' : 'Not Featured'}`}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border active:scale-[0.98] ${
            isFeatured
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-paper text-muted hover:text-ink border-line hover:border-muted/40'
          }`}
        >
          {togglingFeatured ? (
            <span className="animate-pulse">Updating...</span>
          ) : isFeatured ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Featured</span>
            </>
          ) : (
            <>
              <Star className="w-3.5 h-3.5 text-muted/60" />
              <span>Not featured</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Row Actions: Edit (full-page route), Preview on site, Delete */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/40">
        <div className="flex items-center gap-2">
          {/* Edit Full-Page Form Button */}
          <Link
            href={`/admin/artworks/${encodeURIComponent(artworkIdentifier)}`}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-ink bg-paper hover:bg-line border border-line transition-all min-h-[40px] flex items-center gap-1.5 active:scale-95"
          >
            <Pencil className="w-3.5 h-3.5 text-muted" />
            <span>Edit</span>
          </Link>

          {/* Preview on Public Site */}
          <Link
            href={`/artwork/${artwork.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs text-muted hover:text-ink hover:bg-paper transition-all min-h-[40px] flex items-center gap-1"
            title="Preview artwork on public website"
          >
            <Eye className="w-3.5 h-3.5 text-sage" />
            <span>Preview on site</span>
          </Link>
        </div>

        {/* Delete with inline confirmation */}
        {confirmDelete ? (
          <div className="flex items-center gap-1.5 animate-fadeIn">
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-all min-h-[38px]"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-muted hover:text-ink bg-paper border border-line transition-all min-h-[38px]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="p-2 text-muted/80 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95"
            title="Delete artwork"
            aria-label={`Delete artwork ${artwork.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
