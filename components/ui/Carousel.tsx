'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
} from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

export type CarouselVariant = 'hero' | 'cards' | 'gallery';

interface CarouselContextType {
  activeIndex: number;
  slideCount: number;
  totalSlides: number; // alias for slideCount
  canPrev: boolean;
  canNext: boolean;
  canScrollPrev: boolean; // alias for canPrev
  canScrollNext: boolean; // alias for canNext
  scrollPrev: () => void;
  scrollNext: () => void;
  prevSlide: () => void; // alias for scrollPrev
  nextSlide: () => void; // alias for scrollNext
  scrollToSlide: (index: number) => void;
  scrollToIndex: (index: number) => void; // alias for scrollToSlide
  trackRef: React.RefObject<HTMLDivElement>;
  variant: CarouselVariant;
  isPreloaded: (index: number) => boolean;
  slidePrefixId: string;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

/**
 * Check if the track or any of its ancestors has RTL direction.
 */
function isRtlElement(element: HTMLElement | null): boolean {
  if (typeof window === 'undefined' || !element) return false;
  if (element.closest('[dir="rtl"]')) return true;
  return document.dir === 'rtl' || window.getComputedStyle(element).direction === 'rtl';
}

/**
 * Compute the exact step size from the first slide's offsetWidth plus track's column gap.
 * Single source of truth across all breakpoints.
 */
function getStep(track: HTMLElement): number {
  const firstSlide = track.firstElementChild as HTMLElement | null;
  if (!firstSlide) return track.clientWidth || 300;

  const style = window.getComputedStyle(track);
  const gapStr = style.columnGap || style.gap || '0';
  const gap = parseFloat(gapStr) || 0;
  const step = firstSlide.offsetWidth + gap;

  return step > 0 ? step : track.clientWidth;
}

/* =========================================================================
   1. Core Carousel Root Component
   ========================================================================= */

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CarouselVariant;
  ariaLabel: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  showSideFade?: boolean;
  sideFadeColor?: 'light' | 'dark';
  totalSlidesCount?: number;
  onSlideChange?: (index: number) => void;
  children: React.ReactNode;
}

export function Carousel({
  variant = 'cards',
  ariaLabel,
  autoplay = false,
  autoplayInterval = 6500,
  loop = false,
  showArrows = true,
  showDots = true,
  showProgress = false,
  showSideFade = true,
  sideFadeColor = 'light',
  totalSlidesCount,
  onSlideChange,
  className,
  children,
  ...props
}: CarouselProps) {
  // Navigation state derived SOLELY from the track scroll position
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [slideCount, setSlideCount] = useState(totalSlidesCount || 0);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const trackRef = useRef<HTMLDivElement>(null);
  const slidePrefixId = useId();

  // Recompute metrics from track.scrollLeft as single source of truth
  const updateScrollMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, clientWidth, scrollWidth } = track;
    const step = getStep(track);
    const count = track.children.length;

    if (count > 0 && count !== slideCount) {
      setSlideCount(count);
    }

    // Single source of truth calculation:
    // canPrev = scrollLeft > 4
    // canNext = scrollLeft + clientWidth < scrollWidth - 4
    // activeIndex = Math.round(scrollLeft / step), clamped to [0, slideCount - 1]
    const nextCanPrev = scrollLeft > 4;
    const nextCanNext = scrollLeft + clientWidth < scrollWidth - 4;
    const rawIndex = step > 0 ? Math.round(scrollLeft / step) : 0;
    const clampedIndex = Math.max(0, Math.min(rawIndex, Math.max(0, count - 1)));

    setCanPrev(nextCanPrev);
    setCanNext(nextCanNext);
    setActiveIndex(clampedIndex);
    onSlideChange?.(clampedIndex);
  }, [slideCount, onSlideChange]);

  // Scroll listener (throttled with requestAnimationFrame) and ResizeObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateScrollMetrics();
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });

    // ResizeObserver on track and children
    const resizeObserver = new ResizeObserver(() => {
      updateScrollMetrics();
    });

    resizeObserver.observe(track);
    Array.from(track.children).forEach((child) => {
      resizeObserver.observe(child);
    });

    // Initial measurement
    updateScrollMetrics();

    return () => {
      track.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateScrollMetrics]);

  // Arrow step navigation: track.scrollBy({ left: direction * step, behavior })
  const scrollDirection = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;

      const step = getStep(track);
      const isRtl = isRtlElement(track);
      const effectiveDirection = isRtl ? -direction : direction;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      track.scrollBy({
        left: effectiveDirection * step,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    []
  );

  const scrollPrev = useCallback(() => {
    scrollDirection(-1);
  }, [scrollDirection]);

  const scrollNext = useCallback(() => {
    scrollDirection(1);
  }, [scrollDirection]);

  // Dot navigation: track.scrollTo({ left: index * step, behavior })
  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep(track);
    const count = track.children.length || 1;
    const targetIndex = Math.max(0, Math.min(index, count - 1));
    const isRtl = isRtlElement(track);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollTo({
      left: isRtl ? -targetIndex * step : targetIndex * step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  // Preload current slide + adjacent slides
  const isPreloaded = useCallback(
    (index: number) => {
      return (
        index === activeIndex ||
        index === activeIndex + 1 ||
        index === activeIndex - 1
      );
    },
    [activeIndex]
  );

  // Autoplay support (pauses on hover, focus, tab hidden, and reduced motion)
  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) return;
    }

    if (isHovered || isFocused) return;

    const intervalId = setInterval(() => {
      if (document.visibilityState !== 'visible' || !trackRef.current) return;
      const track = trackRef.current;
      const { scrollLeft, clientWidth, scrollWidth } = track;

      // Wrap around if at end, else scroll right by 1 step
      if (scrollLeft + clientWidth >= scrollWidth - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollDirection(1);
      }
    }, autoplayInterval);

    return () => clearInterval(intervalId);
  }, [autoplay, autoplayInterval, slideCount, isHovered, isFocused, scrollDirection]);

  // Update screen-reader live announcements
  useEffect(() => {
    if (slideCount > 0) {
      setLiveAnnouncement(`Slide ${activeIndex + 1} of ${slideCount}`);
    }
  }, [activeIndex, slideCount]);

  // Keyboard navigation on focused track: ArrowLeft, ArrowRight, Home, End
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const track = trackRef.current;
    if (!track) return;
    const isRtl = isRtlElement(track);

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollDirection(isRtl ? 1 : -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollDirection(isRtl ? -1 : 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSlide(slideCount - 1);
    }
  };

  const isLight = sideFadeColor === 'light';
  // Edge fades strictly derived from canPrev / canNext
  const showLeftFade = showSideFade && canPrev;
  const showRightFade = showSideFade && canNext;

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        slideCount,
        totalSlides: slideCount,
        canPrev,
        canNext,
        canScrollPrev: canPrev,
        canScrollNext: canNext,
        scrollPrev,
        scrollNext,
        prevSlide: scrollPrev,
        nextSlide: scrollNext,
        scrollToSlide,
        scrollToIndex: scrollToSlide,
        trackRef,
        variant,
        isPreloaded,
        slidePrefixId,
      }}
    >
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'group/carousel relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage',
          className
        )}
        {...props}
      >
        {/* Screen Reader Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Left Edge Fade Gradient (visible only when canPrev) */}
        {showLeftFade && (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 md:w-16 transition-opacity duration-300',
              isLight
                ? 'bg-gradient-to-r from-paper to-transparent'
                : 'bg-gradient-to-r from-ink to-transparent'
            )}
          />
        )}

        {/* Right Edge Fade Gradient (visible only when canNext) */}
        {showRightFade && (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 md:w-16 transition-opacity duration-300',
              isLight
                ? 'bg-gradient-to-l from-paper to-transparent'
                : 'bg-gradient-to-l from-ink to-transparent'
            )}
          />
        )}

        {children}
      </section>
    </CarouselContext.Provider>
  );
}

/* =========================================================================
   2. Carousel Content / Scroll Track
   ========================================================================= */

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CarouselContent({
  className,
  children,
  ...props
}: CarouselContentProps) {
  const { trackRef, variant } = useCarousel();

  // Mouse Drag support for desktop
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const justFinishedDragRef = useRef(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        if (hasDraggedRef.current) {
          justFinishedDragRef.current = true;
          setTimeout(() => {
            justFinishedDragRef.current = false;
          }, 120);
        }
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || e.button !== 0) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !trackRef.current) return;
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      trackRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
    }
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      if (hasDraggedRef.current) {
        justFinishedDragRef.current = true;
        setTimeout(() => {
          justFinishedDragRef.current = false;
        }, 120);
      }
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (justFinishedDragRef.current || hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onClickCapture={handleClickCapture}
      className={cn(
        'no-scrollbar flex w-full overflow-x-auto select-none',
        // Native CSS Scroll-Snap Track (no transforms)
        variant === 'hero' ? 'gap-0' : 'gap-6 md:gap-8',
        'cursor-grab active:cursor-grabbing',
        className
      )}
      style={{
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: 'inherit',
        WebkitOverflowScrolling: 'touch',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   3. Carousel Item / Slide Wrapper
   ========================================================================= */

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  total?: number;
  children: React.ReactNode;
}

export function CarouselItem({
  index,
  total,
  className,
  children,
  ...props
}: CarouselItemProps) {
  const { slideCount, variant, slidePrefixId } = useCarousel();
  const effectiveTotal = total || slideCount;

  // Responsive slide layout sizing - each slide with scroll-snap-align: start
  const variantClasses = {
    hero: 'w-full shrink-0 snap-start min-h-[100svh]',
    cards:
      'w-[82vw] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-2rem)/3)] shrink-0 snap-start',
    gallery: 'w-full shrink-0 snap-start',
  }[variant];

  return (
    <div
      id={`${slidePrefixId}-slide-${index}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${effectiveTotal}`}
      style={{
        scrollSnapAlign: 'start',
      }}
      className={cn(variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   4. Accessible Arrow Buttons (hidden on touch, disabled state from canPrev/canNext)
   ========================================================================= */

export interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export function CarouselPrevious({
  className,
  iconClassName,
  ...props
}: CarouselButtonProps) {
  const { scrollPrev, canPrev, variant } = useCarousel();

  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canPrev}
      aria-label="Previous slide"
      className={cn(
        // Hidden on touch devices; fine pointer / desktop only
        'hidden md:inline-flex items-center justify-center',
        'rounded-full border border-line bg-paper/90 p-3 text-ink shadow-sm backdrop-blur-sm transition-all',
        'hover:border-ink hover:bg-paper hover:text-ink',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-30',
        variant === 'hero' &&
          'border-white/20 bg-ink/40 text-paper hover:bg-ink/70 hover:text-paper hover:border-white/40',
        className
      )}
      {...props}
    >
      <ChevronLeft className={cn('h-5 w-5', iconClassName)} />
    </button>
  );
}

export function CarouselNext({
  className,
  iconClassName,
  ...props
}: CarouselButtonProps) {
  const { scrollNext, canNext, variant } = useCarousel();

  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canNext}
      aria-label="Next slide"
      className={cn(
        // Hidden on touch devices; fine pointer / desktop only
        'hidden md:inline-flex items-center justify-center',
        'rounded-full border border-line bg-paper/90 p-3 text-ink shadow-sm backdrop-blur-sm transition-all',
        'hover:border-ink hover:bg-paper hover:text-ink',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-30',
        variant === 'hero' &&
          'border-white/20 bg-ink/40 text-paper hover:bg-ink/70 hover:text-paper hover:border-white/40',
        className
      )}
      {...props}
    >
      <ChevronRight className={cn('h-5 w-5', iconClassName)} />
    </button>
  );
}

/* =========================================================================
   5. Interactive Pagination Dots
   ========================================================================= */

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeColor?: string;
  inactiveColor?: string;
}

export function CarouselDots({
  className,
  activeColor,
  inactiveColor,
  ...props
}: CarouselDotsProps) {
  const { activeIndex, slideCount, scrollToSlide, variant } = useCarousel();

  if (slideCount <= 1) return null;
  const isHero = variant === 'hero';

  return (
    <div
      role="tablist"
      aria-label="Carousel pagination"
      className={cn('flex items-center justify-center gap-2.5 py-4', className)}
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${idx + 1} of ${slideCount}`}
            onClick={() => scrollToSlide(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1',
              isActive
                ? cn('w-8', isHero ? 'bg-paper' : activeColor || 'bg-ink')
                : cn('w-2', isHero ? 'bg-paper/40 hover:bg-paper/70' : inactiveColor || 'bg-line hover:bg-muted')
            )}
          />
        );
      })}
    </div>
  );
}

export interface CarouselProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  barClassName?: string;
}

export function CarouselProgress({
  className,
  barClassName,
  ...props
}: CarouselProgressProps) {
  const { activeIndex, slideCount } = useCarousel();

  if (slideCount <= 1) return null;
  const progressPercent = Math.min(100, Math.max(0, ((activeIndex + 1) / slideCount) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={slideCount}
      aria-label={`Slide ${activeIndex + 1} of ${slideCount}`}
      className={cn('h-0.5 w-full overflow-hidden bg-line/60', className)}
      {...props}
    >
      <div
        className={cn('h-full bg-ink transition-all duration-300 ease-out', barClassName)}
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}

/* =========================================================================
   6. Fullscreen Accessible Lightbox
   ========================================================================= */

export interface LightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title = 'Artwork Detail',
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startPanRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapTimeRef = useRef<number>(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusedElementRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (scale === 1 && currentIndex > 0) {
          e.preventDefault();
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (scale === 1 && currentIndex < images.length - 1) {
          e.preventDefault();
          setCurrentIndex((prev) => prev + 1);
        }
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
      const closeBtn = containerRef.current?.querySelector<HTMLElement>(
        'button[aria-label="Close lightbox"]'
      );
      closeBtn?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      previousFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose, scale, currentIndex, images.length]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleToggleZoom = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (scale > 1) {
        setIsPanning(true);
        startPanRef.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialPinchDistRef.current;
      const newScale = Math.max(1, Math.min(3.5, initialScaleRef.current * factor));
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (scale > 1 && isPanning && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - startPanRef.current.x,
        y: e.touches[0].clientY - startPanRef.current.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
    }

    if (scale > 1) {
      setIsPanning(false);
    }

    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      handleToggleZoom();
      lastTapTimeRef.current = 0;
      return;
    }
    lastTapTimeRef.current = now;

    if (scale === 1 && touchStartRef.current && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

      // Swipe down to close lightbox
      if (deltaY > 80 && Math.abs(deltaX) < 80) {
        onClose();
        touchStartRef.current = null;
        return;
      }

      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 60) {
        if (deltaX < 0 && currentIndex < images.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else if (deltaX > 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    }
    touchStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsPanning(true);
      startPanRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (scale > 1 && isPanning) {
      setPosition({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen image gallery: ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between p-4 md:p-6 text-paper">
        <div className="space-y-0.5">
          <h2 className="font-heading text-lg md:text-xl font-normal text-paper tracking-wide">
            {title}
          </h2>
          <p className="text-xs font-light text-paper/70">
            Slide {currentIndex + 1} of {images.length} &bull; Double click or pinch to zoom
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleZoom}
            aria-label={scale > 1 ? 'Zoom out' : 'Zoom in (Double click)'}
            className="rounded-full border border-white/20 bg-ink/40 p-2.5 text-paper/90 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            {scale > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="rounded-full border border-white/20 bg-ink/40 p-2.5 text-paper/90 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 md:p-12 select-none"
        onDoubleClick={handleToggleZoom}
      >
        <div
          className={cn(
            'relative h-full w-full transition-transform',
            isPanning ? 'duration-0 cursor-grabbing' : 'duration-300 ease-out cursor-zoom-in',
            scale > 1 && !isPanning && 'cursor-grab'
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <Image
            src={currentImage}
            alt={`${title} - view ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority={true}
            placeholder="blur"
            blurDataURL={getCloudinaryBlurUrl(currentImage)}
            className="object-contain"
          />
        </div>
      </div>

      {/* Left/Right Arrow Navigation Controls */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }
            }}
            disabled={currentIndex === 0}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full border border-white/20 bg-ink/40 p-3 text-paper/90 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentIndex < images.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }
            }}
            disabled={currentIndex === images.length - 1}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full border border-white/20 bg-ink/40 p-3 text-paper/90 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:pointer-events-none disabled:opacity-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Bottom Thumbnails Strip in Lightbox */}
          <div className="absolute bottom-4 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  aria-label={`View image ${idx + 1}`}
                  className={cn(
                    'relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded border transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                    isSelected
                      ? 'border-paper ring-2 ring-sage opacity-100 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-80'
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL={getCloudinaryBlurUrl(img)}
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================================
   7. Gallery Carousel Component
   ========================================================================= */

export interface GalleryCarouselProps {
  images: string[];
  title: string;
  className?: string;
  aspectRatio?: string;
}

export function GalleryCarousel({
  images,
  title,
  className,
  aspectRatio = 'aspect-[4/5]',
}: GalleryCarouselProps) {
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ['/images/nocturne-in-ochre.svg'];

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Carousel
        variant="gallery"
        ariaLabel={`${title} Gallery`}
        totalSlidesCount={displayImages.length}
        onSlideChange={(idx) => setActiveThumbIndex(idx)}
        showArrows={displayImages.length > 1}
        showDots={false}
        className="w-full"
      >
        <div className="relative border border-line bg-paper p-3 shadow-md">
          <CarouselContent className="w-full">
            {displayImages.map((img, idx) => (
              <CarouselItem key={idx} index={idx} total={displayImages.length} className="w-full">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightboxAt(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightboxAt(idx);
                    }
                  }}
                  aria-label={`Open fullscreen view of ${title} (Slide ${idx + 1} of ${displayImages.length})`}
                  style={{
                    viewTransitionName: idx === 0 ? 'artwork-hero' : undefined,
                  }}
                  className={cn(
                    'group/thumb relative block w-full overflow-hidden bg-mist/30 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                    aspectRatio
                  )}
                >
                  <Image
                    src={img}
                    alt={`${title} - view ${idx + 1}`}
                    fill
                    loading={idx <= 1 ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL={getCloudinaryBlurUrl(img)}
                    className="object-cover transition-transform duration-700 ease-out group-hover/thumb:scale-105 motion-reduce:transform-none"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink/75 px-2.5 py-1 text-[11px] font-medium tracking-wider text-paper backdrop-blur-sm transition-opacity opacity-90 group-hover/thumb:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Inspect Detail</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {displayImages.length > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6">
              <CarouselPrevious className="pointer-events-auto" />
              <CarouselNext className="pointer-events-auto" />
            </div>
          )}
        </div>

        {displayImages.length > 1 && (
          <ThumbnailStrip
            images={displayImages}
            activeIndex={activeThumbIndex}
            onSelectThumb={(idx) => {
              setActiveThumbIndex(idx);
            }}
          />
        )}
      </Carousel>

      <Lightbox
        images={displayImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
      />
    </div>
  );
}

function ThumbnailStrip({
  images,
  activeIndex,
  onSelectThumb,
}: {
  images: string[];
  activeIndex: number;
  onSelectThumb: (index: number) => void;
}) {
  const { scrollToSlide } = useCarousel();

  return (
    <div
      role="tablist"
      aria-label="Artwork detail views"
      className="flex gap-3 overflow-x-auto no-scrollbar pt-2"
    >
      {images.map((img, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`Show view ${idx + 1}`}
            onClick={() => {
              onSelectThumb(idx);
              scrollToSlide(idx);
            }}
            className={cn(
              'relative h-20 w-20 flex-shrink-0 border bg-paper p-1 transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
              isSelected
                ? 'border-ink ring-2 ring-sage shadow-sm'
                : 'border-line opacity-70 hover:opacity-100'
            )}
          >
            <div className="relative h-full w-full overflow-hidden bg-mist/20">
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                placeholder="blur"
                blurDataURL={getCloudinaryBlurUrl(img)}
                className="object-cover"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
