'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { IArtwork } from '@/types/artwork';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedWorkGridProps {
  artworks: IArtwork[];
}

export function SelectedWorkGrid({ artworks }: SelectedWorkGridProps) {
  const displayItems = artworks.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll state driven strictly by track.scrollLeft
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Mouse drag state with click suppression when pointer moved > 5px
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const justDraggedRef = useRef(false);

  // Update arrow disabled states directly from track.scrollLeft
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth, scrollWidth } = track;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateScrollState();
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(track);
    Array.from(track.children).forEach((child) => resizeObserver.observe(child));

    // Initial check
    updateScrollState();

    return () => {
      track.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateScrollState]);

  // Compute step size: first slide's offsetWidth + 12px gap
  const getStepSize = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 300;
    const firstSlide = track.firstElementChild as HTMLElement | null;
    if (!firstSlide) return track.clientWidth || 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '12') || 12;
    return firstSlide.offsetWidth + gap;
  }, []);

  const scrollPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepSize();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: -step, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [getStepSize]);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepSize();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: step, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [getStepSize]);

  // Mouse Drag Support with click suppression when pointer moved > 5px
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !trackRef.current) return;
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !trackRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
      trackRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
    }
  };

  const handlePointerUpOrCancel = () => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      if (hasDraggedRef.current) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 120);
      }
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (justDraggedRef.current || hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Keyboard navigation on track
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <section
      className="bg-paper py-20 md:py-28 overflow-hidden"
      aria-labelledby="selected-work-title"
    >
      {/* 
        Container Gutter CSS variable matching page container:
        Mobile: 24px
        Tablet/Laptop: 48px
        Desktop >= 1280px: calc((100vw - 1280px) / 2 + 48px)
      */}
      <style jsx>{`
        .selected-work-section {
          --container-gutter: 24px;
        }
        @media (min-width: 768px) {
          .selected-work-section {
            --container-gutter: 48px;
          }
        }
        @media (min-width: 1280px) {
          .selected-work-section {
            --container-gutter: max(48px, calc((100vw - 1280px) / 2 + 48px));
          }
        }

        .selected-work-slide {
          width: calc((100vw - var(--container-gutter)) / 1.3);
          flex-shrink: 0;
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .selected-work-slide {
            width: calc((100vw - var(--container-gutter)) / 2.3);
          }
        }
        @media (min-width: 1024px) {
          .selected-work-slide {
            width: calc((100vw - var(--container-gutter)) / 3.2);
          }
        }
        @media (min-width: 1280px) {
          .selected-work-slide {
            width: calc((100vw - var(--container-gutter)) / 4.3);
          }
        }
      `}</style>

      <div className="selected-work-section space-y-10">
        {/* Section Header Row: Title & Subtitle at Left, Plain "View all" and 40px Arrows at Right */}
        <div
          className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <h2
              id="selected-work-title"
              className="font-heading text-4xl sm:text-5xl text-ink font-normal tracking-tight"
            >
              Selected work
            </h2>
            <p className="mt-2 text-sm text-muted font-light">
              Original paintings and archival print editions from the Hudson studio.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start sm:self-end">
            <Link
              href="/originals"
              className="text-sm font-normal text-ink hover:text-sage transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              View all
            </Link>

            {/* Small 40px round arrows next to "View all" on desktop, hidden on touch */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label="Previous artworks"
                className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-ink transition-all hover:border-ink disabled:opacity-25 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                disabled={!canNext}
                aria-label="Next artworks"
                className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-ink transition-all hover:border-ink disabled:opacity-25 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Bleed Scroll Track */}
        <div
          ref={trackRef}
          role="region"
          aria-label="Selected work carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onClickCapture={handleClickCapture}
          className="flex w-full overflow-x-auto no-scrollbar gap-[12px] cursor-grab active:cursor-grabbing select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage"
          style={{
            scrollSnapType: 'x mandatory',
            paddingInlineStart: 'var(--container-gutter)',
            scrollPaddingInlineStart: 'var(--container-gutter)',
            paddingInlineEnd: 'var(--container-gutter)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {displayItems.map((artwork, idx) => (
            <div key={artwork.id || artwork._id || artwork.slug} className="selected-work-slide">
              <ArtworkCardItem
                artwork={artwork}
                priority={idx < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SelectedWorkGrid;
