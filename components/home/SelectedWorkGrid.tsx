'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Link from 'next/link';
import { IArtwork } from '@/types/artwork';
import { ArtworkCardItem } from '@/components/gallery/ArtworkCardItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectedWorkGridProps {
  artworks: IArtwork[];
  title?: string;
  subtitle?: string | null;
  viewAllHref?: string;
  viewAllLabel?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
  priorityLimit?: number;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function SelectedWorkGrid({
  artworks,
  title = 'Selected work',
  subtitle = 'Original paintings and archival print editions from the Hudson studio.',
  viewAllHref = '/originals',
  viewAllLabel = 'View all',
  ariaLabel = 'Selected work carousel',
  id = 'selected-work-title',
  className = 'bg-paper py-20 md:py-28',
  priorityLimit = 2,
}: SelectedWorkGridProps) {
  const displayItems = artworks.slice(0, 8);
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  // Measure first slide's image wrapper and set --img-h on the slider container
  const updateImageHeight = useCallback(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    // Measure the first slide's image wrapper (excluding title)
    const imgWrapper = track.querySelector<HTMLElement>('.artwork-image-wrapper');
    if (imgWrapper) {
      const { height } = imgWrapper.getBoundingClientRect();
      if (height > 0) {
        wrapper.style.setProperty('--img-h', `${height}px`);
      }
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateImageHeight();

    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(() => {
      updateImageHeight();
      updateScrollState();
    });

    resizeObserver.observe(track);
    const firstSlide = track.firstElementChild;
    if (firstSlide) {
      resizeObserver.observe(firstSlide);
      const imgWrapper = firstSlide.querySelector('.artwork-image-wrapper');
      if (imgWrapper) {
        resizeObserver.observe(imgWrapper);
      }
    }

    window.addEventListener('resize', updateImageHeight, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateImageHeight);
    };
  }, [updateImageHeight, updateScrollState]);

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
      className={cn('w-full overflow-x-clip', className)}
      aria-labelledby={id}
    >
      {/* 
        Full-bleed gallery row specifications:
        --gutter: clamp(16px, 4vw, 56px)
        --gap: 12px
        --scrollbar-w: calc(100vw - 100%)
        --viewport-w: calc(100vw - var(--scrollbar-w, 0px))
        Slide width:
          Desktop (>=1280px): calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 3) / 4.2)
          Laptop (>=1024px): calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 2) / 3.2)
          Tablet (>=768px): calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 1) / 2.2)
          Mobile (<768px): calc((var(--viewport-w) - var(--gutter) * 2) / 1.25)
      */}
      <style jsx>{`
        .selected-work-section {
          --gutter: clamp(16px, 4vw, 56px);
          --gap: 12px;
          --scrollbar-w: calc(100vw - 100%);
          --viewport-w: calc(100vw - var(--scrollbar-w, 0px));
          --slide-w: calc((var(--viewport-w) - var(--gutter) * 2) / 1.25);
          width: 100%;
          overflow-x: clip;
        }
        @media (min-width: 768px) {
          .selected-work-section {
            --slide-w: calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 1) / 2.2);
          }
        }
        @media (min-width: 1024px) {
          .selected-work-section {
            --slide-w: calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 2) / 3.2);
          }
        }
        @media (min-width: 1280px) {
          .selected-work-section {
            --slide-w: calc((var(--viewport-w) - var(--gutter) * 2 - var(--gap) * 3) / 4.2);
          }
        }

        .selected-work-header {
          width: 100%;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        .slider-track-container {
          --img-h: calc(var(--slide-w) * 1.25);
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .slider-nav-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: var(--img-h);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: calc(var(--gutter) + 16px);
          padding-right: calc(var(--gutter) + 16px);
          pointer-events: none;
          z-index: 5;
        }

        .slider-track {
          display: flex;
          width: 100%;
          overflow-x: auto;
          column-gap: var(--gap);
          padding-left: var(--gutter);
          padding-right: var(--gutter);
          scroll-padding-left: var(--gutter);
          scroll-padding-right: var(--gutter);
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .selected-work-slide {
          width: var(--slide-w);
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .slider-nav-btn {
          display: none;
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.92);
          border: 1px solid #e3dfda;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: opacity 200ms ease, transform 200ms ease, background-color 200ms ease, border-color 200ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .slider-nav-btn {
            display: flex;
          }
        }

        .slider-nav-btn:hover {
          background-color: #ffffff;
          transform: scale(1.06);
        }

        .slider-nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #5f7b6b, 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .slider-nav-btn.cannot-prev,
        .slider-nav-btn.cannot-next {
          opacity: 0;
          pointer-events: none;
        }

        .slider-nav-btn.can-prev,
        .slider-nav-btn.can-next {
          opacity: 1;
          pointer-events: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .slider-nav-btn {
            transition: none;
          }
          .slider-nav-btn:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="selected-work-section space-y-10">
        {/* Full-width Section Header Row: Title at Left, Plain "View all" at Right */}
        <div className="selected-work-header flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2
              id={id}
              className="font-heading text-4xl sm:text-5xl text-ink font-normal tracking-tight"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted font-light">
                {subtitle}
              </p>
            )}
          </div>

          <div className="self-start sm:self-end">
            <Link
              href={viewAllHref}
              className="text-sm font-normal text-ink hover:text-sage transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              {viewAllLabel}
            </Link>
          </div>
        </div>

        {/* Relative Slider Container: Starts exactly where the images start */}
        <div ref={wrapperRef} className="slider-track-container">
          {/* Overlay div: top: 0, left: 0, right: 0, height: var(--img-h), align-items: center */}
          <div className="slider-nav-overlay">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollPrev();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={!canPrev}
              aria-label="Previous artworks"
              aria-hidden={!canPrev}
              tabIndex={canPrev ? 0 : -1}
              className={cn(
                'slider-nav-btn slider-nav-prev',
                canPrev ? 'can-prev' : 'cannot-prev'
              )}
            >
              <ChevronLeft className="w-5 h-5 text-ink shrink-0" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollNext();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={!canNext}
              aria-label="Next artworks"
              aria-hidden={!canNext}
              tabIndex={canNext ? 0 : -1}
              className={cn(
                'slider-nav-btn slider-nav-next',
                canNext ? 'can-next' : 'cannot-next'
              )}
            >
              <ChevronRight className="w-5 h-5 text-ink shrink-0" />
            </button>
          </div>

          {/* Full-Bleed Scroll Track */}
          <div
            ref={trackRef}
            role="region"
            aria-label={ariaLabel}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
            onClickCapture={handleClickCapture}
            className="slider-track no-scrollbar cursor-grab active:cursor-grabbing select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage"
          >
            {displayItems.map((artwork, idx) => (
              <div key={artwork.id || artwork._id || artwork.slug} className="selected-work-slide">
                <ArtworkCardItem
                  artwork={artwork}
                  priority={idx < priorityLimit}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectedWorkGrid;
export { SelectedWorkGrid as ArtworkSlider };
