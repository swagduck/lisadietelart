import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function CommissionsSection() {
  return (
    <section
      className="border-b border-line bg-mist/20 px-6 py-24 md:px-12"
      aria-labelledby="commissions-section-title"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
        {/* Left: Studio image */}
        <div className="relative lg:col-span-5">
          <div className="border border-line bg-paper p-3 shadow-md">
            <div className="relative aspect-[4/5] overflow-hidden bg-mist/40">
              <Image
                src="/images/artist-studio.svg"
                alt="Lisa Dietel in the painting studio working on a custom commission"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 hidden max-w-[200px] border border-line bg-paper p-4 text-center shadow-lg sm:block">
            <p className="font-heading text-2xl text-sage">Custom Scale</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
              Bespoke Palettes
            </p>
          </div>
        </div>

        {/* Right: Copy & CTA */}
        <div className="space-y-6 lg:col-span-7">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Bespoke Artwork &middot; Private Commissions
          </span>

          <h2
            id="commissions-section-title"
            className="font-heading text-4xl font-normal leading-tight text-ink sm:text-5xl"
          >
            Original paintings created specifically for your home and architectural space.
          </h2>

          <div className="space-y-4 text-sm font-light leading-relaxed text-muted md:text-base">
            <p>
              A commission is a collaborative journey. Whether you are seeking a grand
              focal piece for a double-height living room or an intimate triptych for a
              private sanctuary, Lisa Dietel works closely with you or your interior
              designer.
            </p>
            <p>
              Each project begins with a conversation about scale, lighting conditions,
              and the emotive resonance of the room, followed by small-scale color studies
              before the final linen is hand-stretched.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/commissions"
              className="bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-paper shadow-sm transition-all duration-300 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Explore Commission Process &amp; Pricing
            </Link>
            <Link
              href="/contact"
              className="border border-ink px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink transition-all duration-300 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Inquire Directly
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommissionsSection;
