'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-line bg-paper text-ink transition-colors">
      {/* Newsletter / Studio Dispatch Section */}
      <div className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Collector&apos;s Circle &middot; Private Previews
          </span>
          <h3 className="font-heading text-3xl font-normal md:text-4xl">
            Subscribe to the Studio Dispatch
          </h3>
          <p className="mx-auto max-w-lg text-xs font-light leading-relaxed text-muted md:text-sm">
            Subscribers receive private access to new studio collections 48 hours before
            public release, invitations to gallery vernissages, and quarterly essay
            letters on painterly process.
          </p>

          {subscribed ? (
            <div className="mx-auto max-w-md border border-line bg-mist/60 p-4 text-xs uppercase tracking-widest text-sage">
              Thank you. You have been added to Aura Vance&apos;s private collector
              roster.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto flex max-w-md flex-col gap-2 pt-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@example.com"
                className="flex-1 border border-line bg-paper px-4 py-3 text-xs focus:border-sage focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage"
              >
                Join Dispatch
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 text-xs md:grid-cols-4 md:px-12">
        {/* Col 1: Artist Bio & Studio */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex flex-col">
            <span className="font-heading text-2xl text-ink">Aura Vance</span>
            <span className="text-[10px] uppercase tracking-widest text-muted">
              Fine Art &middot; Hudson Valley Studio
            </span>
          </div>
          <p className="text-[11px] font-light leading-relaxed text-muted">
            Contemporary paintings constructed with earth pigments, raw walnut oils, and
            French linen. Exploring silence, geological memory, and subtle light.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            Navigation
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link href="/works" className="transition-colors hover:text-sage">
                Selected Works Archive
              </Link>
            </li>
            <li>
              <Link href="/shop" className="transition-colors hover:text-sage">
                Available Originals &amp; Prints
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-sage">
                Artist Biography &amp; Practice
              </Link>
            </li>
            <li>
              <Link href="/#exhibitions" className="transition-colors hover:text-sage">
                Exhibition History &amp; CV
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Collector Services */}
        <div className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            Acquisitions &amp; Care
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link href="/contact" className="transition-colors hover:text-sage">
                Private Commission Inquiries
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-sage">
                Studio Visit Scheduling
              </Link>
            </li>
            <li>
              <span className="text-muted">Insured White-Glove Shipping</span>
            </li>
            <li>
              <span className="text-muted">Certificates of Authenticity</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Representation & Socials */}
        <div className="space-y-3">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
            Follow &amp; Representation
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-sage"
              >
                Instagram &middot; @auravance.art
              </a>
            </li>
            <li>
              <a
                href="https://artsy.net"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-sage"
              >
                Artsy Profile
              </a>
            </li>
            <li>
              <a
                href="https://substack.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-sage"
              >
                Substack &middot; Letters on Oil &amp; Linen
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[11px] text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Aura Vance Fine Art. All rights reserved.
          </p>
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
