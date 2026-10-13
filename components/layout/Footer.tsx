import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { NewsletterForm } from './NewsletterForm';
import { Instagram, Globe, Mail, Truck, ShieldCheck } from 'lucide-react';

export function Footer() {
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
          <span className="block text-xs font-normal text-sage">
            Collector&apos;s circle &middot; Private previews
          </span>
          <h2
            id="newsletter-heading"
            className="font-heading text-3xl font-normal text-ink md:text-4xl"
          >
            Join Lisa Dietel&apos;s studio dispatch
          </h2>
          <p className="mx-auto max-w-lg text-xs font-light leading-relaxed text-muted md:text-sm">
            Receive exclusive private access to newly released original paintings and
            limited edition prints 48 hours before public exhibitions, alongside quarterly
            letters from the easel.
          </p>

          <NewsletterForm />
        </div>
      </section>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 text-xs md:grid-cols-4 md:px-12">
        {/* Col 1: Brand & Studio */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex flex-col">
            <span className="font-heading text-2xl text-ink">Lisa Dietel</span>
            <span className="text-xs font-light text-muted">
              Fine art &middot; Studio
            </span>
          </div>
          <p className="text-xs font-light leading-relaxed text-muted max-w-[40ch]">
            Original oil and mineral paintings exploring atmospheric horizon lines,
            memory, and silence on European flax linen.
          </p>
        </div>

        {/* Col 2: Collections */}
        <nav aria-label="Footer Collection Links" className="space-y-3">
          <span className="block text-xs font-normal text-muted">
            Collections
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <TransitionLink
                href="/originals"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Original paintings
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="/prints"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Archival art prints
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="/commissions"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Bespoke commissions
              </TransitionLink>
            </li>
          </ul>
        </nav>

        {/* Col 3: The Studio & Shipping Info */}
        <nav aria-label="Footer Studio Links" className="space-y-3">
          <span className="block text-xs font-normal text-muted">
            The studio
          </span>
          <ul className="space-y-2 text-ink/80">
            <li>
              <TransitionLink
                href="/about"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                About the artist
              </TransitionLink>
            </li>
            <li>
              <TransitionLink
                href="/contact"
                className="rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Private inquiries &amp; appointments
              </TransitionLink>
            </li>
            <li className="flex items-center gap-1.5 text-muted pt-1">
              <Truck className="h-3.5 w-3.5 text-sage flex-shrink-0" />
              <span>Complimentary insured shipping</span>
            </li>
            <li className="flex items-center gap-1.5 text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-sage flex-shrink-0" />
              <span>Signed Certificate of Authenticity</span>
            </li>
          </ul>
        </nav>

        {/* Col 4: Social Icons & Connect */}
        <div className="space-y-3">
          <span className="block text-xs font-normal text-muted">
            Connect
          </span>
          <ul className="space-y-2.5 text-ink/80">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <Instagram className="h-4 w-4 text-sage" />
                <span>Instagram &middot; @lisadietelart</span>
              </a>
            </li>
            <li>
              <a
                href="https://artsy.net"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <Globe className="h-4 w-4 text-sage" />
                <span>Artsy gallery profile</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:studio@lisadietelart.com"
                className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <Mail className="h-4 w-4 text-sage" />
                <span>studio@lisadietelart.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
          <p>&copy; 2025 Lisa Dietel Fine Art. All rights reserved.</p>
          <div className="flex space-x-6 text-xs text-muted/80">
            <span>Privacy policy</span>
            <span>Terms of acquisition</span>
            <span>Archival care guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
