'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IArtwork } from '@/types/artwork';
import { formatPrice } from '@/lib/format';
import { useCart } from '../shop/CartContext';
import { X, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ArtworkModalProps {
  artwork: IArtwork | null;
  onClose: () => void;
}

export function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
  const { addItem } = useCart();
  const [selectedType, setSelectedType] = useState<'original' | 'print'>('original');
  const [selectedPrintIndex, setSelectedPrintIndex] = useState<number>(0);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!artwork) return null;

  const currentPrint = artwork.printOptions?.[selectedPrintIndex];

  const handleAddToCart = () => {
    if (selectedType === 'original' && artwork.isOriginalAvailable) {
      addItem({
        artworkId: artwork.id,
        title: artwork.title,
        slug: artwork.slug,
        type: 'original',
        price: artwork.price,
        imageUrl: artwork.imageUrl,
        medium: artwork.medium,
      });
    } else if (currentPrint) {
      addItem({
        artworkId: artwork.id,
        title: artwork.title,
        slug: artwork.slug,
        type: 'print',
        variant: `Archival Pigment Print (${currentPrint.size})`,
        price: currentPrint.price,
        imageUrl: artwork.imageUrl,
        medium: artwork.medium,
      });
    }

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="artwork-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-4xl overflow-hidden border border-line bg-paper p-6 shadow-2xl md:p-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-20 rounded-full p-2 text-muted transition-colors hover:text-ink"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
            {/* Left: Artwork Frame */}
            <div className="space-y-4 md:col-span-6">
              <div className="relative aspect-[4/5] border border-line bg-mist/30 p-2 shadow-sm">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted">
                <span>Natural daylight rendering</span>
                <span>Original created {artwork.year}</span>
              </div>
            </div>

            {/* Right: Collector Specs & Acquisition Options */}
            <div className="space-y-6 md:col-span-6">
              <div>
                <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.25em] text-sage">
                  {artwork.category}
                </span>
                <h2
                  id="artwork-modal-title"
                  className="font-heading text-3xl font-normal leading-tight text-ink md:text-4xl"
                >
                  {artwork.title}
                </h2>
                <p className="mt-2 text-xs text-muted">{artwork.dimensions}</p>
              </div>

              {/* Physical details list */}
              <div className="space-y-1.5 border-y border-line py-4 text-xs">
                <div className="grid grid-cols-3">
                  <span className="text-muted">Medium</span>
                  <span className="col-span-2 font-light text-ink">{artwork.medium}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted">Substrate</span>
                  <span className="col-span-2 font-light text-ink">
                    {artwork.surface}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted">Status</span>
                  <span className="col-span-2 font-medium capitalize text-ink">
                    {artwork.status === 'available'
                      ? 'Available for Acquisition'
                      : artwork.status}
                  </span>
                </div>
              </div>

              {/* Backstory & Process */}
              <div className="space-y-2 text-xs font-light leading-relaxed text-muted md:text-sm">
                <p>{artwork.description}</p>
                {artwork.story && (
                  <p className="italic text-ink/75">&ldquo;{artwork.story}&rdquo;</p>
                )}
              </div>

              {/* Buying Options */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 text-xs uppercase tracking-wider">
                  {artwork.isOriginalAvailable && (
                    <button
                      type="button"
                      onClick={() => setSelectedType('original')}
                      className={`flex-1 border px-3 py-2.5 text-center transition-all ${
                        selectedType === 'original'
                          ? 'border-ink bg-ink font-medium text-paper'
                          : 'border-line bg-paper text-muted hover:border-ink'
                      }`}
                    >
                      Original Painting ({formatPrice(artwork.price)})
                    </button>
                  )}

                  {artwork.hasPrints && artwork.printOptions && (
                    <button
                      type="button"
                      onClick={() => setSelectedType('print')}
                      className={`flex-1 border px-3 py-2.5 text-center transition-all ${
                        selectedType === 'print' || !artwork.isOriginalAvailable
                          ? 'border-ink bg-ink font-medium text-paper'
                          : 'border-line bg-paper text-muted hover:border-ink'
                      }`}
                    >
                      Archival Print
                    </button>
                  )}
                </div>

                {/* Print Size Selection dropdown if prints selected */}
                {(selectedType === 'print' || !artwork.isOriginalAvailable) &&
                  artwork.printOptions && (
                    <div className="space-y-2 border border-line bg-mist/30 p-3 text-xs">
                      <label className="block text-[10px] font-medium uppercase tracking-wider text-muted">
                        Select Archival Edition Size:
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {artwork.printOptions.map((opt, idx) => (
                          <button
                            key={opt.size}
                            type="button"
                            onClick={() => setSelectedPrintIndex(idx)}
                            className={`flex items-center justify-between border px-3 py-2 text-left transition-colors ${
                              selectedPrintIndex === idx
                                ? 'border-sage bg-paper font-medium text-ink shadow-sm'
                                : 'border-line bg-paper/60 text-muted hover:border-ink'
                            }`}
                          >
                            <span>
                              {opt.size} &middot; 310gsm Hahnem&uuml;hle German Etching
                            </span>
                            <span className="font-sans font-medium text-ink">
                              {formatPrice(opt.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Add to Cart button */}
                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-xs font-medium uppercase tracking-widest text-paper shadow-sm transition-colors hover:bg-sage"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="h-4 w-4 text-paper" />
                        Added to Collector Cart
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Add to Selection &middot;{' '}
                        {selectedType === 'original' && artwork.isOriginalAvailable
                          ? formatPrice(artwork.price)
                          : currentPrint
                            ? formatPrice(currentPrint.price)
                            : ''}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-sage" /> Insured global art
                      transit
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-sage" /> Signed Studio COA
                    </span>
                  </div>
                </div>

                {/* Direct Acquisition Inquiry link */}
                <div className="pt-2 text-center">
                  <Link
                    href={`/contact?artwork=${encodeURIComponent(artwork.title)}`}
                    onClick={onClose}
                    className="text-xs uppercase tracking-wider text-muted underline hover:text-ink"
                  >
                    Have questions about this piece? Inquire directly with the artist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworkModal;
