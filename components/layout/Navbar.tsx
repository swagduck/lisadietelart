'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../shop/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Turn solid after scrolling 80px or past hero top
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
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
    { label: 'Art Prints', href: '/prints' },
    { label: 'Commissions', href: '/commissions' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isSolid = !isHome || isScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
          isSolid
            ? 'border-b border-line bg-paper/95 text-ink shadow-sm backdrop-blur-md'
            : 'border-b border-white/15 bg-transparent text-paper'
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
            <span className="font-heading text-2xl font-normal tracking-wide transition-colors group-hover:text-sage md:text-3xl">
              Lisa Dietel
            </span>
            <span
              className={cn(
                '-mt-1 font-sans text-[10px] uppercase tracking-[0.25em] transition-colors',
                isSolid ? 'text-muted' : 'text-paper/80'
              )}
            >
              Fine Art &middot; Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center space-x-9 text-xs font-light uppercase tracking-widest md:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
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
              aria-controls="mobile-navigation-drawer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu (Drawer) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Panel from Right */}
          <div className="animate-in slide-in-from-right fixed inset-y-0 right-0 flex w-full max-w-xs flex-col justify-between border-l border-line bg-paper p-6 shadow-2xl duration-300">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-line pb-6">
                <div>
                  <span className="block font-heading text-2xl text-ink">
                    Lisa Dietel
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted">
                    Fine Art &middot; Studio
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4 py-6" aria-label="Mobile Menu Links">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block rounded-sm border-b border-line/40 py-2 text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage',
                        isActive
                          ? 'border-l-2 border-l-sage pl-2 font-medium text-sage'
                          : 'text-ink/80 hover:text-sage'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom info in mobile menu */}
            <div className="space-y-2 border-t border-line pt-6 text-xs text-muted">
              <p className="font-medium text-ink">Private Studio &amp; Gallery</p>
              <p>Inquiries: studio@lisadietelart.com</p>
              <p className="text-[11px] text-muted">Worldwide insured courier delivery</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
