'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../shop/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isHome = pathname === '/';

  // Header scroll detection: solid on scroll & hide on scroll down / show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solid background after 60px
      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll and support Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Originals', href: '/originals' },
    { label: 'Art prints', href: '/prints' },
    { label: 'Commissions', href: '/commissions' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isSolid = !isHome || isScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-40 transition-all duration-300 ease-in-out',
          isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full',
          isSolid
            ? 'border-b border-line bg-paper/95 text-ink shadow-sm backdrop-blur-md'
            : 'border-b border-white/10 bg-transparent text-paper'
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Brand Signature */}
          <Link
            href="/"
            className={cn(
              'group flex flex-col rounded-sm p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
              isSolid ? 'text-ink' : 'text-paper'
            )}
            aria-label="Lisa Dietel Art - Home"
          >
            <span className="font-heading text-2xl font-normal tracking-tight transition-colors group-hover:text-sage md:text-3xl">
              Lisa Dietel
            </span>
            <span
              className={cn(
                '-mt-1 font-sans text-xs font-light transition-colors',
                isSolid ? 'text-muted' : 'text-paper/80'
              )}
            >
              Fine art &middot; Studio
            </span>
          </Link>

          {/* Desktop Navigation in Sentence Case */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center space-x-8 text-sm font-normal md:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={true}
                  className={cn(
                    'relative rounded-sm px-1 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
                    isSolid
                      ? isActive
                        ? 'font-medium text-sage'
                        : 'text-ink/80 hover:text-sage'
                      : isActive
                        ? 'font-medium text-paper underline decoration-sage underline-offset-8'
                        : 'text-paper/90 hover:text-paper'
                  )}
                >
                  {link.label}
                  {isActive && isSolid && (
                    <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-sage" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Cart & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openCart}
              className={cn(
                'relative rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
                isSolid ? 'text-ink hover:text-sage' : 'text-paper hover:text-paper/80'
              )}
              aria-label={`View selection bag with ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="animate-in fade-in absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sage text-[10px] font-medium text-paper">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                'rounded-sm p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 md:hidden',
                isSolid ? 'text-ink hover:text-sage' : 'text-paper hover:text-paper/80'
              )}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-fullscreen"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu with Smooth Slide */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-fullscreen"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-paper p-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Header Bar inside Menu */}
          <div className="flex items-center justify-between border-b border-line/60 pb-6">
            <div>
              <span className="block font-heading text-2xl text-ink">
                Lisa Dietel
              </span>
              <span className="text-xs text-muted">
                Fine art &middot; Studio
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-mist/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              aria-label="Close mobile menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links with Large Elegant Serif Typography */}
          <nav className="my-auto space-y-6 py-8" aria-label="Mobile Menu Links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block font-heading text-3xl font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                    isActive
                      ? 'text-sage pl-3 border-l-2 border-sage'
                      : 'text-ink/80 hover:text-sage'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Studio Info */}
          <div className="border-t border-line/60 pt-6 text-xs text-muted space-y-1.5">
            <p className="font-medium text-ink">Lisa Dietel Studio &amp; Archive</p>
            <p>Private inquiries: studio@lisadietelart.com</p>
            <p className="text-[11px] text-muted">Complimentary insured courier delivery worldwide</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
