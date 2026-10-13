'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Layers, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

interface WallPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  dimensions?: string;
  medium?: string;
}

const WALL_PALETTES = [
  { id: 'paper', name: 'Alabaster Paper', color: '#f7f6f4', isDark: false },
  { id: 'greige', name: 'Warm Greige', color: '#eae5dc', isDark: false },
  { id: 'sage', name: 'Soft Sage', color: '#dbe2dd', isDark: false },
  { id: 'mist', name: 'Linen Mist', color: '#e1e6e4', isDark: false },
  { id: 'slate', name: 'Gallery Slate', color: '#393c41', isDark: true },
];

function parseDimensions(dimStr?: string): {
  widthInches: number;
  heightInches: number;
  formattedText: string;
} {
  if (!dimStr) {
    return { widthInches: 30, heightInches: 40, formattedText: '30 × 40 in (approx.)' };
  }

  const isCm = dimStr.toLowerCase().includes('cm');
  const numbers = dimStr.match(/\d+(?:\.\d+)?/g);

  if (numbers && numbers.length >= 2) {
    let w = parseFloat(numbers[0]);
    let h = parseFloat(numbers[1]);
    if (isCm) {
      const wIn = Math.round(w / 2.54);
      const hIn = Math.round(h / 2.54);
      return {
        widthInches: wIn,
        heightInches: hIn,
        formattedText: `${dimStr} (approx. ${wIn} × ${hIn} in)`,
      };
    }
    const wCm = Math.round(w * 2.54);
    const hCm = Math.round(h * 2.54);
    return {
      widthInches: w,
      heightInches: h,
      formattedText: `${dimStr} (${wCm} × ${hCm} cm)`,
    };
  }

  return { widthInches: 30, heightInches: 40, formattedText: dimStr };
}

export function WallPreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  dimensions,
  medium,
}: WallPreviewModalProps) {
  const [selectedWall, setSelectedWall] = useState(WALL_PALETTES[0]);
  const [showConsole, setShowConsole] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { widthInches, heightInches, formattedText } = parseDimensions(dimensions);

  // Calculate realistic scale against standard 96-inch (8 ft) ceiling
  // Normalise height ratio (clamped between 25% and 60% of wall viewport)
  const wallCeilingInches = 96;
  const rawHeightPercent = (heightInches / wallCeilingInches) * 100;
  const artworkHeightPercent = Math.max(26, Math.min(62, rawHeightPercent));
  const aspectRatio = widthInches / heightInches;

  // Keyboard trap & Escape listener
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        if (!containerRef.current) return;
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      const closeBtn = containerRef.current?.querySelector<HTMLElement>('button[aria-label="Close wall preview"]');
      closeBtn?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`See ${title} on your wall`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300"
    >
      {/* Modal Dialog Card */}
      <div className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-line bg-paper shadow-2xl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-line/70 bg-paper px-6 py-4">
          <div>
            <h2 className="font-heading text-xl font-normal text-ink">
              See it on your wall
            </h2>
            <p className="text-xs font-light text-muted">
              {title} &bull; {formattedText}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Console Table Toggle */}
            <button
              type="button"
              onClick={() => setShowConsole(!showConsole)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              aria-label="Toggle interior furniture reference"
            >
              <Layers className="h-3.5 w-3.5 text-sage" />
              <span>{showConsole ? 'Hide furniture' : 'Show furniture'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close wall preview"
              className="rounded-full p-2 text-muted transition-colors hover:bg-mist/30 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Realistic Interactive Wall Room Stage */}
        <div
          className="relative flex-1 overflow-hidden transition-colors duration-500 flex flex-col justify-between"
          style={{ backgroundColor: selectedWall.color }}
        >
          {/* Subtle Ceiling Downlight Accent */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60"
            style={{
              background: selectedWall.isDark
                ? 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,255,255,0.08), transparent 70%)'
                : 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,255,255,0.7), transparent 70%)',
            }}
          />

          {/* Top Wall Space */}
          <div className="w-full pt-6" />

          {/* Centered Artwork at Realistic Scale */}
          <div className="relative mx-auto flex items-center justify-center my-auto px-6 w-full">
            <div
              className="relative transition-all duration-300"
              style={{
                height: `${artworkHeightPercent}vh`,
                width: `${artworkHeightPercent * aspectRatio}vh`,
                maxHeight: '440px',
                maxWidth: '85vw',
              }}
            >
              {/* Natural Drop Shadow on Wall */}
              <div
                className="relative h-full w-full overflow-hidden border border-black/10 bg-paper"
                style={{
                  boxShadow: selectedWall.isDark
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 2px rgba(255,255,255,0.1)'
                    : '0 20px 45px -15px rgba(43, 42, 46, 0.25), 0 4px 10px -2px rgba(43, 42, 46, 0.1)',
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`${title} hanging in room`}
                  fill
                  placeholder="blur"
                  blurDataURL={getCloudinaryBlurUrl(imageUrl)}
                  className="object-cover"
                  sizes="500px"
                />
              </div>

              {/* Realistic Scale Tag overlay */}
              <div
                className={cn(
                  'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-wide transition-opacity opacity-75',
                  selectedWall.isDark ? 'text-paper/80' : 'text-ink/70'
                )}
              >
                {formattedText}
              </div>
            </div>
          </div>

          {/* Floor & Interior Reference: Minimalist Oak Console Table & Flooring */}
          <div className="relative w-full">
            {showConsole && (
              <div className="mx-auto w-72 md:w-96 flex flex-col items-center">
                {/* Console Top Surface */}
                <div className="h-3 w-full rounded-sm bg-[#c2a98f] shadow-md border-t border-[#d8c5ad]" />
                {/* Console Legs & Storage */}
                <div className="flex w-11/12 justify-between">
                  <div className="h-16 w-3 bg-[#a88f76]" />
                  <div className="h-16 w-3 bg-[#a88f76]" />
                </div>
              </div>
            )}

            {/* Baseboard & Wood Floor Line */}
            <div className="w-full">
              <div className="h-3 w-full border-b border-black/10 bg-[#e4ded5]" />
              <div className="h-8 w-full bg-[#d0c6b8] shadow-inner" />
            </div>
          </div>
        </div>

        {/* Bottom Wall Color Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/70 bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-sage" />
              <span>Wall color:</span>
            </span>

            <div className="flex items-center gap-2" role="radiogroup" aria-label="Select wall background color">
              {WALL_PALETTES.map((wall) => {
                const isSelected = selectedWall.id === wall.id;
                return (
                  <button
                    key={wall.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={wall.name}
                    onClick={() => setSelectedWall(wall)}
                    className={cn(
                      'relative h-7 w-7 rounded-full border transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                      isSelected
                        ? 'border-ink ring-2 ring-sage scale-110'
                        : 'border-line hover:scale-105'
                    )}
                    style={{ backgroundColor: wall.color }}
                  >
                    <span className="sr-only">{wall.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs font-light text-muted">
            Simulated on an 8 ft (2.4 m) gallery wall
          </div>
        </div>
      </div>
    </div>
  );
}

export default WallPreviewModal;
