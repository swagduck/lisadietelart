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
  totalSlides: number;
  setTotalSlides: (total: number) => void;
  scrollToIndex: (index: number) => void;
  prevSlide: () => void;
  nextSlide: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isDragging: boolean;
  variant: CarouselVariant;
  isPreloaded: (index: number) => boolean;
  updateActiveIndexFromScroll: (index: number) => void;
  trackRef: React.RefObject<HTMLDivElement>;
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(totalSlidesCount || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slidePrefixId = useId();

  // Keep totalSlides in sync if prop provided
  useEffect(() => {
    if (totalSlidesCount !== undefined && totalSlidesCount !== totalSlides) {
      setTotalSlides(totalSlidesCount);
    }
  }, [totalSlidesCount, totalSlides]);

  const canScrollPrev = loop ? true : activeIndex > 0;
  const canScrollNext = loop ? true : activeIndex < totalSlides - 1;

  // Preload current slide + next slide
  const isPreloaded = useCallback(
    (index: number) => {
      if (totalSlides <= 0) return true;
      const nextIndex = (activeIndex + 1) % totalSlides;
      const prevIndex = (activeIndex - 1 + totalSlides) % totalSlides;
      return index === activeIndex || index === nextIndex || index === prevIndex;
    },
    [activeIndex, totalSlides]
  );

  // Smooth scroll track to target index
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!trackRef.current || totalSlides === 0) return;
      const targetIndex = loop
        ? (index + totalSlides) % totalSlides
        : Math.max(0, Math.min(index, totalSlides - 1));

      const track = trackRef.current;
      const slides = Array.from(track.children) as HTMLElement[];
      const targetSlide = slides[targetIndex];

      if (targetSlide) {
        const trackLeft = track.getBoundingClientRect().left;
        const slideLeft = targetSlide.getBoundingClientRect().left;
        const offset = slideLeft - trackLeft + track.scrollLeft;

        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        track.scrollTo({
          left: offset,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }

      setActiveIndex(targetIndex);
      onSlideChange?.(targetIndex);
      setLiveAnnouncement(`Slide ${targetIndex + 1} of ${totalSlides}`);
    },
    [loop, totalSlides, onSlideChange]
  );

  // Directly sync activeIndex from IntersectionObserver scroll without triggering scrollTo
  const updateActiveIndexFromScroll = useCallback(
    (targetIndex: number) => {
      setActiveIndex(targetIndex);
      onSlideChange?.(targetIndex);
      setLiveAnnouncement(`Slide ${targetIndex + 1} of ${totalSlides}`);
    },
    [totalSlides, onSlideChange]
  );

  const prevSlide = useCallback(() => {
    if (canScrollPrev) {
      scrollToIndex(activeIndex - 1);
    }
  }, [canScrollPrev, activeIndex, scrollToIndex]);

  const nextSlide = useCallback(() => {
    if (canScrollNext) {
      scrollToIndex(activeIndex + 1);
    }
  }, [canScrollNext, activeIndex, scrollToIndex]);

  // Autoplay handler with pauses on hover, focus, tab-hidden, and reduced motion
  useEffect(() => {
    if (!autoplay || totalSlides <= 1) return;

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) return;
    }

    if (isHovered || isFocused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    autoplayTimerRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        scrollToIndex((activeIndex + 1) % totalSlides);
      }
    }, autoplayInterval);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoplay, autoplayInterval, totalSlides, isHovered, isFocused, activeIndex, scrollToIndex]);

  // Keyboard navigation handler (Left, Right, Home, End)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToIndex(totalSlides - 1);
    }
  };

  const isLight = sideFadeColor === 'light';
  const showLeftFade = showSideFade && variant === 'cards' && activeIndex > 0;
  const showRightFade = showSideFade && variant === 'cards' && activeIndex < totalSlides - 1;

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        totalSlides,
        setTotalSlides,
        scrollToIndex,
        prevSlide,
        nextSlide,
        canScrollPrev,
        canScrollNext,
        isDragging,
        variant,
        isPreloaded,
        updateActiveIndexFromScroll,
        trackRef,
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
        {/* Screen Reader Live Region for Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Left Side Fade Gradient */}
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

        {/* Right Side Fade Gradient */}
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
   2. Carousel Track (Scroll-Snap & Mouse/Touch Drag)
   ========================================================================= */

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CarouselContent({
  className,
  children,
  ...props
}: CarouselContentProps) {
  const { trackRef, activeIndex, updateActiveIndexFromScroll, setTotalSlides, variant } = useCarousel();

  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const justFinishedDragRef = useRef(false);

  // Sync total children slides count
  useEffect(() => {
    if (!trackRef.current) return;
    const slides = Array.from(trackRef.current.children);
    setTotalSlides(slides.length);
  }, [children, setTotalSlides, trackRef]);

  // Global mouseup listener so drag ends even if pointer leaves carousel div
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

  // IntersectionObserver to sync activeIndex on scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find slide with highest intersection ratio
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry && bestEntry.intersectionRatio >= 0.5) {
          const idx = Number(bestEntry.target.getAttribute('data-slide-index'));
          if (!Number.isNaN(idx)) {
            // Only update if changed
            if (idx !== activeIndex) {
              updateActiveIndexFromScroll(idx);
            }
          }
        }
      },
      {
        root: track,
        threshold: [0.5, 0.75],
      }
    );

    slides.forEach((slide, idx) => {
      slide.setAttribute('data-slide-index', String(idx));
      observer.observe(slide);
    });

    return () => {
      observer.disconnect();
    };
  }, [trackRef, activeIndex, updateActiveIndexFromScroll]);

  // Mouse Drag Support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    // Only primary mouse button
    if (e.button !== 0) return;

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

  // Prevent accidental card/link click if user was dragging
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
        'scroll-smooth',
        // Native CSS Scroll-Snap
        variant === 'hero' ? 'snap-x snap-mandatory' : 'snap-x snap-mandatory gap-6 md:gap-8',
        'cursor-grab active:cursor-grabbing',
        className
      )}
      style={{
        scrollSnapType: 'x mandatory',
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
  const { totalSlides, variant, slidePrefixId } = useCarousel();
  const effectiveTotal = total || totalSlides;

  // Responsive peek sizing for variants
  const variantClasses = {
    // Hero: full-bleed 100svh
    hero: 'w-full shrink-0 snap-center min-h-[100svh]',
    // Cards: 1.15 visible on mobile (peek of next slide), 2 on tablet, 3 on desktop
    cards:
      'w-[82vw] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-2rem)/3)] shrink-0 snap-start',
    // Gallery: single large image item per slide
    gallery: 'w-full shrink-0 snap-center',
  }[variant];

  return (
    <div
      id={`${slidePrefixId}-slide-${index}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${effectiveTotal}`}
      className={cn(variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   4. Accessible Arrow Buttons (hidden on touch, disabled at ends, focus-visible)
   ========================================================================= */

export interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export function CarouselPrevious({
  className,
  iconClassName,
  ...props
}: CarouselButtonProps) {
  const { prevSlide, canScrollPrev, variant } = useCarousel();

  return (
    <button
      type="button"
      onClick={prevSlide}
      disabled={!canScrollPrev}
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
  const { nextSlide, canScrollNext, variant } = useCarousel();

  return (
    <button
      type="button"
      onClick={nextSlide}
      disabled={!canScrollNext}
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
   5. Interactive Pagination Dots & Thin Progress Bar
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
  const { activeIndex, totalSlides, scrollToIndex, variant } = useCarousel();

  if (totalSlides <= 1) return null;

  const isHero = variant === 'hero';

  return (
    <div
      role="tablist"
      aria-label="Carousel pagination"
      className={cn('flex items-center justify-center gap-2.5 py-4', className)}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${idx + 1} of ${totalSlides}`}
            onClick={() => scrollToIndex(idx)}
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
  const { activeIndex, totalSlides } = useCarousel();

  if (totalSlides <= 1) return null;
  const progressPercent = Math.min(100, Math.max(0, ((activeIndex + 1) / totalSlides) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={totalSlides}
      aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}
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
   6. Fullscreen Accessible Lightbox (Pinch/Double-Click Zoom, Swipe, Esc, Focus Trap)
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

  // Focus trap & Key listeners (Escape, Arrows)
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
        // Focus trap
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

    // Initial focus on close button
    const timer = setTimeout(() => {
      const closeBtn = containerRef.current?.querySelector<HTMLElement>('button[aria-label="Close lightbox"]');
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

  // Touch Swipe & Pinch Support
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

    // Double tap to toggle zoom
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

      // Horizontal swipe threshold
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

  // Desktop Mouse Pan when Zoomed
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
          {/* Zoom Toggle Button */}
          <button
            type="button"
            onClick={handleToggleZoom}
            aria-label={scale > 1 ? 'Zoom out' : 'Zoom in (Double click)'}
            className="rounded-full border border-white/20 bg-ink/40 p-2.5 text-paper/90 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            {scale > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>

          {/* Close Lightbox Button */}
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
   7. Gallery Carousel Component (Large Image per slide + Thumbnails + Fullscreen Lightbox)
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

                  {/* Visual expand badge in corner */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink/75 px-2.5 py-1 text-[11px] font-medium tracking-wider text-paper backdrop-blur-sm transition-opacity opacity-90 group-hover/thumb:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Inspect Detail</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows for Gallery */}
          {displayImages.length > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6">
              <CarouselPrevious className="pointer-events-auto" />
              <CarouselNext className="pointer-events-auto" />
            </div>
          )}
        </div>

        {/* Thumbnail Strip underneath */}
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

      {/* Fullscreen Lightbox Modal */}
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
  const { scrollToIndex } = useCarousel();

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
              scrollToIndex(idx);
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
