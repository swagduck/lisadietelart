'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export interface TransitionLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  sharedImageRef?: React.RefObject<HTMLElement>;
  sharedTitleRef?: React.RefObject<HTMLElement>;
}

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    {
      href,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      sharedImageRef,
      sharedTitleRef,
      prefetch = true,
      children,
      ...props
    },
    ref
  ) {
    const router = useRouter();
    const { navigateWithTransition } = usePageTransition();
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

    const hrefString =
      typeof href === 'string'
        ? href
        : typeof href === 'object' && href !== null
          ? href.pathname || ''
          : '';

    // Hover-intent prefetch: prefetch after 80ms of intentional hover
    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(e);
      if (hrefString && !hrefString.startsWith('#') && !hrefString.startsWith('mailto:')) {
        hoverTimerRef.current = setTimeout(() => {
          router.prefetch(hrefString);
        }, 80);
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseLeave?.(e);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };

    // Instant touch prefetch on mobile
    const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
      onTouchStart?.(e);
      if (hrefString && !hrefString.startsWith('#') && !hrefString.startsWith('mailto:')) {
        router.prefetch(hrefString);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      // Only handle standard primary left clicks with no keyboard modifiers
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        props.target === '_blank'
      ) {
        return;
      }

      // Bypass protocol links or external domains
      if (
        !hrefString ||
        hrefString.startsWith('mailto:') ||
        hrefString.startsWith('tel:') ||
        (hrefString.startsWith('http') &&
          typeof window !== 'undefined' &&
          !hrefString.startsWith(window.location.origin))
      ) {
        return;
      }

      e.preventDefault();
      navigateWithTransition(hrefString, {
        sharedImageElement: sharedImageRef?.current,
        sharedTitleElement: sharedTitleRef?.current,
      });
    };

    return (
      <Link
        ref={ref}
        href={href}
        prefetch={prefetch}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = 'TransitionLink';
export default TransitionLink;
