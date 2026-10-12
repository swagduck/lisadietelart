'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../shop/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Selected Works', href: '/works' },
    { label: 'Originals & Prints', href: '/shop' },
    { label: 'The Studio', href: '/about' },
    { label: 'Exhibitions', href: '/#exhibitions' },
    { label: 'Inquire', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="border-b border-line bg-mist/40 px-6 py-2 text-center text-xs uppercase tracking-widest text-muted">
        Complimentary worldwide insured shipping on original oil paintings &middot; Winter
        Studio Release
      </aside>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Brand Signature */}
          <Link href="/" className="group flex flex-col focus:outline-none">
            <span className="font-heading text-2xl font-normal tracking-wide text-ink transition-colors group-hover:text-sage md:text-3xl">
              Aura Vance
            </span>
            <span className="-mt-1 font-sans text-[10px] uppercase tracking-[0.25em] text-muted">
              Fine Art &middot; Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-10 text-xs font-light uppercase tracking-widest text-ink/80 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative py-1 transition-colors duration-200 hover:text-sage',
                    isActive && 'font-normal text-sage'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-sage" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart + Mobile Menu Trigger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="relative p-2 text-ink transition-colors hover:text-sage"
              aria-label={`View cart with ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="animate-in fade-in absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sage text-[10px] font-medium text-paper">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink transition-colors hover:text-sage md:hidden"
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="animate-in slide-in-from-top-4 space-y-4 border-b border-line bg-paper px-6 py-6 duration-200 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-line/40 py-2 text-sm uppercase tracking-widest text-ink/80 hover:text-sage"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 text-xs text-muted">
              <p>Studio location: Hudson Valley, New York</p>
              <p>Inquiries: studio@auravance.art</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
