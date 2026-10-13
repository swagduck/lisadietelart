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

  // Stored values in refs to avoid redundant re-renders
  const canPrevRef = useRef(false);
  const canNextRef = useRef(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Pointer drag state with threshold check
  const isPointerDownRef = useRef(false);
  const hasCapturedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const justDraggedRef = useRef(false);

  // Smooth scroll navigation flags to ignore mid-animation scroll updates
  const isNavigatingRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastImgHeightRef = useRef(0);

  // Update arrow disabled/visibility states with hysteresis
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth, scrollWidth } = track;
    const remaining = scrollWidth - (scrollLeft + clientWidth);

    // Hysteresis for Prev: hide when scrollLeft < 4, show when scrollLeft > 12
    let nextCanPrev = canPrevRef.current;
    if (canPrevRef.current) {
      if (scrollLeft < 4) nextCanPrev = false;
    } else {
      if (scrollLeft > 12) nextCanPrev = true;
    }

    // Hysteresis for Next: hide when remaining < 4, show when remaining > 12
    let nextCanNext = canNextRef.current;
    if (canNextRef.current) {
      if (remaining < 4) nextCanNext = false;
    } else {
      if (remaining > 12) nextCanNext = true;
    }

    // Update state only if values actually changed
    if (nextCanPrev !== canPrevRef.current) {
      canPrevRef.current = nextCanPrev;
      setCanPrev(nextCanPrev);
    }
    if (nextCanNext !== canNextRef.current) {
      canNextRef.current = nextCanNext;
      setCanNext(nextCanNext);
    }
  }, []);

  // Settle scroll handler when animation completes
  const settleScroll = useCallback(() => {
    isNavigatingRef.current = false;
    if (scrollEndTimerRef.current !== null) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
    updateScrollState();
  }, [updateScrollState]);

  // Measure first slide's image wrapper and set --img-h on the slider container
  const updateImageHeight = useCallback(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    // Measure the first slide's image wrapper (excluding title)
    const imgWrapper = track.querySelector<HTMLElement>('.artwork-image-wrapper');
    if (imgWrapper) {
      const h = Math.round(imgWrapper.getBoundingClientRect().height);
      if (h > 0 && h !== lastImgHeightRef.current) {
        lastImgHeightRef.current = h;
        wrapper.style.setProperty('--img-h', `${h}px`);
      }
    }
  }, []);

  // ResizeObserver observes the track only to avoid loops
  useIsomorphicLayoutEffect(() => {
    updateImageHeight();
    updateScrollState();

    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(() => {
      updateImageHeight();
      updateScrollState();
    });

    resizeObserver.observe(track);
    window.addEventListener('resize', updateImageHeight, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateImageHeight);
    };
  }, [updateImageHeight, updateScrollState]);

  // Scroll listeners on track with scrollend and debounced fallback
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      if (isNavigatingRef.current) {
        if (scrollEndTimerRef.current !== null) {
          clearTimeout(scrollEndTimerRef.current);
        }
        scrollEndTimerRef.current = window.setTimeout(settleScroll, 120);
        return;
      }

      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateScrollState();
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    track.addEventListener('scrollend', settleScroll, { passive: true });

    return () => {
      track.removeEventListener('scroll', handleScroll);
      track.removeEventListener('scrollend', settleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (scrollEndTimerRef.current !== null) clearTimeout(scrollEndTimerRef.current);
    };
  }, [updateScrollState, settleScroll]);

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
    isNavigatingRef.current = true;
    const step = getStepSize();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: -step, behavior: prefersReduced ? 'auto' : 'smooth' });

    if (prefersReduced) {
      isNavigatingRef.current = false;
      updateScrollState();
    } else {
      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(settleScroll, 120);
    }
  }, [getStepSize, settleScroll, updateScrollState]);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    isNavigatingRef.current = true;
    const step = getStepSize();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: step, behavior: prefersReduced ? 'auto' : 'smooth' });

    if (prefersReduced) {
      isNavigatingRef.current = false;
      updateScrollState();
    } else {
      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(settleScroll, 120);
    }
  }, [getStepSize, settleScroll, updateScrollState]);

  // Mouse Drag Support attached to track only: capture only after > 5px movement
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on arrow buttons or arrow layer
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, [data-arrow]')) return;
    if (e.button !== 0 || !trackRef.current) return;

    // Reset drag state on every pointerdown
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    hasCapturedRef.current = false;
    justDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !trackRef.current) return;
    const deltaX = e.clientX - startXRef.current;

    // Capture pointer only if moved more than 5px
    if (!hasCapturedRef.current && Math.abs(deltaX) > 5) {
      hasCapturedRef.current = true;
      hasDraggedRef.current = true;
      try {
        trackRef.current.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (hasCapturedRef.current) {
      trackRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (hasCapturedRef.current && trackRef.current) {
      try {
        trackRef.current.releasePointerCapture(e.pointerId);
      } catch {}
      hasCapturedRef.current = false;
    }

    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      if (hasDraggedRef.current) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 50);
      }
    }
  };

  // Click suppression strictly prevents opening links when dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current || justDraggedRef.current) {
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
          isolation: isolate;
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
          z-index: 20;
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
          z-index: 0;
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
          user-select: none;
          -webkit-user-select: none;
        }

        @media (hover: hover) and (pointer: fine) {
          .slider-nav-btn {
            display: flex;
          }
        }

        .slider-nav-btn.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition: opacity 200ms ease, visibility 0s linear 0s, background-color 150ms ease, box-shadow 150ms ease;
        }

        .slider-nav-btn.is-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 200ms ease, visibility 0s linear 200ms, background-color 150ms ease, box-shadow 150ms ease;
        }

        .slider-nav-btn:hover {
          background-color: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
        }

        .slider-nav-btn:active {
          background-color: #f7f6f4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .slider-nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #5f7b6b, 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        @media (prefers-reduced-motion: reduce) {
          .slider-nav-btn.is-visible,
          .slider-nav-btn.is-hidden {
            transition: none;
          }
        }
      `}</style>

      <div className="selected-work-section space-y-10">
        {/* Full-width Section Header Row: OUTSIDE the track container */}
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
          {displayItems.length === 0 ? (
            <div className="py-16 text-center w-full px-6">
              <p className="text-sm font-light text-muted">
                New studio selections are currently being staged.
              </p>
            </div>
          ) : (
            <>
              {/* Overlay div: top: 0, left: 0, right: 0, height: var(--img-h), align-items: center */}
              <div className="slider-nav-overlay">
            {/* Prev Arrow */}
            <button
              type="button"
              data-arrow="prev"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollPrev();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              disabled={!canPrev}
              aria-label="Previous artworks"
              aria-hidden={!canPrev}
              tabIndex={canPrev ? 0 : -1}
              className={cn(
                'slider-nav-btn slider-nav-prev',
                canPrev ? 'is-visible' : 'is-hidden'
              )}
            >
              <ChevronLeft className="w-5 h-5 text-ink shrink-0" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              data-arrow="next"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollNext();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              disabled={!canNext}
              aria-label="Next artworks"
              aria-hidden={!canNext}
              tabIndex={canNext ? 0 : -1}
              className={cn(
                'slider-nav-btn slider-nav-next',
                canNext ? 'is-visible' : 'is-hidden'
              )}
            >
              <ChevronRight className="w-5 h-5 text-ink shrink-0" />
            </button>
          </div>

          {/* Full-Bleed Scroll Track: Drag listeners on track ONLY */}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SelectedWorkGrid;
export { SelectedWorkGrid as ArtworkSlider };
