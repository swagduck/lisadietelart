'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      className="border-t border-line bg-paper text-ink transition-colors"
      aria-label="Site Footer"
    >
      {/* Newsletter Section */}
      <section
        className="border-b border-line bg-mist/20 px-6 py-16 md:px-12"
        aria-labelledby="newsletter-heading"
      >
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Collector&apos;s Circle &middot; Private Previews
          </span>
          <h2
            id="newsletter-heading"
            className="font-heading text-3xl font-normal text-ink md:text-4xl"
          >
            Join Lisa Dietel&apos;s Studio Dispatch
          </h2>
          <p className="mx-auto max-w-lg text-xs font-light leading-relaxed text-muted md:text-sm">
            Receive exclusive private access to newly released original paintings and
            limited edition prints 48 hours before public exhibitions, alongside quarterly
            letters from the easel.
          </p>

          {subscribed ? (
            <div className="mx-auto max-w-md border border-line bg-mist/60 p-4 text-xs uppercase tracking-widest text-sage">
              Thank you. You have been added to Lisa Dietel&apos;s private collector
              roster.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto flex max-w-md flex-col gap-2 pt-2 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for studio newsletter
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@example.com"
                className="flex-1 border border-line bg-paper px-4 py-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                Join Dispatch
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 text-xs md:grid-cols-4 md:px-12">
        {/* Col 1: Brand & Studio */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex flex-col">
            <span className="font-heading text-2xl text-ink">Lisa Dietel</span>
            <span className="text-[10px] uppercase tracking-widest text-muted">
              Fine Art &middot; Studio
            </span>
          </div>
          <p className="text-[11px] font-light leading-relaxed text-muted">
            Original oil and mineral paintings exploring atmospheric horizon lines,
            memory, and silence on European flax linen.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <nav aria-label="Footer Collection Links" className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            Collections
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link
                href="/originals"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Original Paintings
              </Link>
            </li>
            <li>
              <Link
                href="/prints"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Archival Art Prints
              </Link>
            </li>
            <li>
              <Link
                href="/commissions"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Bespoke Commissions
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Studio & Practice */}
        <nav aria-label="Footer Studio Links" className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            The Studio
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link
                href="/about"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                About the Artist
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Private Inquiries &amp; Appointments
              </Link>
            </li>
            <li>
              <span className="text-muted">Insured Courier Shipping</span>
            </li>
            <li>
              <span className="text-muted">Certificate of Authenticity</span>
            </li>
          </ul>
        </nav>

        {/* Col 4: Social Links */}
        <div className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            Follow &amp; Connect
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Instagram &middot; @lisadietelart
              </a>
            </li>
            <li>
              <a
                href="https://artsy.net"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Artsy Profile
              </a>
            </li>
            <li>
              <a
                href="https://substack.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Substack &middot; Letters from the Studio
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[11px] text-muted sm:flex-row">
          <p>&copy; 2025 Lisa Dietel Fine Art. All rights reserved.</p>
          <div className="flex space-x-6 text-[10px] uppercase tracking-wider">
            <span>Privacy Policy</span>
            <span>Terms of Acquisition</span>
            <span>Archival Care Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
