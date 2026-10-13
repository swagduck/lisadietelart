'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface PageTransitionContextValue {
  navigateWithTransition: (
    href: string,
    options?: {
      sharedImageElement?: HTMLElement | null;
      sharedTitleElement?: HTMLElement | null;
    }
  ) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Resolver reference for the Promise passed to document.startViewTransition
  const pendingResolverRef = useRef<(() => void) | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // References to active shared element elements to clean up viewTransitionName afterwards
  const activeSharedElementsRef = useRef<{
    img?: HTMLElement | null;
    title?: HTMLElement | null;
  }>({});

  // Perceived-speed slim top progress bar state
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressScale, setProgressScale] = useState(0);
  const [progressTransition, setProgressTransition] = useState('none');
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressFinishTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Screen reader route announcement
  const [announcement, setAnnouncement] = useState('');

  // 1. Resolve pending transition & finish progress bar on route changes
  useEffect(() => {
    // Resolve view transition promise
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    if (pendingResolverRef.current) {
      pendingResolverRef.current();
      pendingResolverRef.current = null;
    }

    // Cancel progress bar timer if pending
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    // If progress bar was active, animate it to 100% and fade out
    if (progressVisible) {
      setProgressScale(1);
      setProgressTransition('transform 120ms ease-out, opacity 180ms ease');
      if (progressFinishTimerRef.current) {
        clearTimeout(progressFinishTimerRef.current);
      }
      progressFinishTimerRef.current = setTimeout(() => {
        setProgressVisible(false);
        setProgressScale(0);
        setProgressTransition('none');
      }, 200);
    }

    // Focus management: move focus to main heading and announce page change
    const frameId = requestAnimationFrame(() => {
      const mainHeading = document.querySelector<HTMLElement>('main h1, #main-content h1, h1');
      if (mainHeading) {
        if (!mainHeading.hasAttribute('tabindex')) {
          mainHeading.setAttribute('tabindex', '-1');
        }
        mainHeading.focus({ preventScroll: true });
      }
      const pageTitle = document.title || 'Page loaded';
      setAnnouncement(`Navigated to ${pageTitle}`);
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname, progressVisible]);

  // 2. Listen to popstate (browser back/forward buttons) and wrap in startViewTransition
  useEffect(() => {
    const handlePopState = () => {
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        try {
          (document as unknown as { startViewTransition: (cb: () => Promise<void>) => void }).startViewTransition(
            () =>
              new Promise<void>((resolve) => {
                pendingResolverRef.current = resolve;
                safetyTimeoutRef.current = setTimeout(() => {
                  if (pendingResolverRef.current) {
                    pendingResolverRef.current();
                    pendingResolverRef.current = null;
                  }
                }, 1500);
              })
          );
        } catch {
          // Graceful fallback if popstate transition fails
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Core navigation handler with View Transitions API & progressive enhancement
  const navigateWithTransition = useCallback(
    (
      href: string,
      options?: {
        sharedImageElement?: HTMLElement | null;
        sharedTitleElement?: HTMLElement | null;
      }
    ) => {
      // Check if user prefers reduced motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Extract path and hash
      const [targetPath, targetHash] = href.split('#');

      // Hash navigation on current page: smooth scroll to section, respect sticky header
      if ((targetPath === '' || targetPath === pathname) && targetHash) {
        const targetEl = document.getElementById(targetHash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          return;
        }
      }

      // Same pathname without hash: scroll to top
      if (targetPath === pathname && !targetHash) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }

      // If target is /admin/login: keep navigation instant without transition
      if (href === '/admin/login') {
        router.push(href);
        return;
      }

      // Check if native View Transitions API is supported
      const hasViewTransition =
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !prefersReducedMotion;

      if (!hasViewTransition) {
        // Fallback: router.push (CSS fallback animation will play via template.tsx)
        router.push(href);
        return;
      }

      // Perceived-speed: show slim top progress bar ONLY if navigation takes longer than 150ms
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
      progressTimerRef.current = setTimeout(() => {
        if (!prefersReducedMotion) {
          setProgressVisible(true);
          setProgressScale(0.7);
          setProgressTransition('transform 900ms cubic-bezier(0.1, 0.5, 0.1, 1), opacity 150ms ease');
        }
      }, 150);

      // Shared-element transition: apply viewTransitionName strictly before startViewTransition
      if (options?.sharedImageElement) {
        options.sharedImageElement.style.viewTransitionName = 'artwork-hero';
        activeSharedElementsRef.current.img = options.sharedImageElement;
      }
      if (options?.sharedTitleElement) {
        options.sharedTitleElement.style.viewTransitionName = 'artwork-title';
        activeSharedElementsRef.current.title = options.sharedTitleElement;
      }

      try {
        const transition = (
          document as unknown as {
            startViewTransition: (
              cb: () => Promise<void>
            ) => { finished: Promise<void> };
          }
        ).startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              pendingResolverRef.current = resolve;
              safetyTimeoutRef.current = setTimeout(() => {
                if (pendingResolverRef.current) {
                  pendingResolverRef.current();
                  pendingResolverRef.current = null;
                }
              }, 1500); // 1500ms safety timeout

              // Forward navigation: scroll to top after transition starts
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              router.push(href);
            })
        );

        // Clear viewTransitionName after the transition completes
        transition.finished.finally(() => {
          if (activeSharedElementsRef.current.img) {
            activeSharedElementsRef.current.img.style.viewTransitionName = '';
            activeSharedElementsRef.current.img = null;
          }
          if (activeSharedElementsRef.current.title) {
            activeSharedElementsRef.current.title.style.viewTransitionName = '';
            activeSharedElementsRef.current.title = null;
          }
        });
      } catch {
        // If startViewTransition throws, clean up and fall back to plain push
        if (activeSharedElementsRef.current.img) {
          activeSharedElementsRef.current.img.style.viewTransitionName = '';
          activeSharedElementsRef.current.img = null;
        }
        if (activeSharedElementsRef.current.title) {
          activeSharedElementsRef.current.title.style.viewTransitionName = '';
          activeSharedElementsRef.current.title = null;
        }
        router.push(href);
      }
    },
    [pathname, router]
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      {/* Slim Top Navigation Progress Bar (2px, sage, transform-based) */}
      <div
        role="progressbar"
        aria-hidden="true"
        aria-label="Navigation progress"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#5f7b6b',
          zIndex: 9999,
          pointerEvents: 'none',
          transformOrigin: '0% 50%',
          transform: `scaleX(${progressScale})`,
          opacity: progressVisible ? 1 : 0,
          transition: progressTransition,
        }}
      />

      {/* Screen Reader Live Region for Accessible Route Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {children}
    </PageTransitionContext.Provider>
  );
}
