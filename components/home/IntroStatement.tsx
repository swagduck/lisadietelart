import React from 'react';
import Link from 'next/link';

export function IntroStatement() {
  return (
    <section className="border-b border-line bg-paper px-6 py-24 md:px-12">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <span className="block text-xs font-normal text-sage">
          Studio philosophy &middot; Lisa Dietel
        </span>

        <h2 className="font-heading text-3xl font-normal leading-tight text-ink sm:text-5xl md:text-6xl">
          Paintings rooted in geology, silence, and the quiet movement of natural light.
        </h2>

        <div className="mx-auto max-w-[65ch] space-y-4 text-sm font-light leading-relaxed text-muted md:text-base">
          <p>
            Working with raw European flax linen, natural earth minerals, and cold-pressed
            walnut oil, every piece is constructed through slow, translucent layers. The
            resulting textures evoke the geological memory of wild coastlines and misty
            valleys.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/originals"
            prefetch={true}
            className="rounded-sm bg-ink px-8 py-3.5 text-xs font-normal text-paper shadow-sm transition-all duration-300 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            Explore originals
          </Link>
          <Link
            href="/prints"
            prefetch={true}
            className="rounded-sm border border-line bg-paper px-8 py-3.5 text-xs font-normal text-ink transition-all duration-300 hover:border-ink hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            View art prints
          </Link>
        </div>
      </div>
    </section>
  );
}

export default IntroStatement;
