import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function AboutSection() {
  return (
    <section id="studio" className="border-b border-line bg-mist/20 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-12">
        {/* Left: Studio Photography */}
        <div className="relative lg:col-span-5">
          <div className="border border-line bg-paper p-3 shadow-md">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/artist-studio.svg"
                alt="Aura Vance in the Hudson Valley Studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 hidden max-w-[210px] border border-line bg-paper p-5 text-center shadow-lg sm:block">
            <p className="font-heading text-3xl text-sage">14 Years</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
              Oil &amp; Mineral Practice
            </p>
          </div>
        </div>

        {/* Right: Studio Practice & Philosophy */}
        <div className="space-y-6 lg:col-span-7">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            The Studio Practice
          </span>
          <h2 className="font-heading text-4xl font-normal leading-tight text-ink md:text-5xl">
            Crafted slowly with natural earth minerals, cold-pressed oils, and silence.
          </h2>

          <div className="space-y-4 text-sm font-light leading-relaxed text-muted md:text-base">
            <p>
              Working from a sunlit converted stone barn in the Hudson Valley, Aura Vance
              approaches every canvas as an unfolding dialogue between geological pigment
              and human recollection.
            </p>
            <p>
              Each piece is constructed over weeks or months through translucent glazes,
              scraped impasto, and hand-ground lapis, raw umber, and chalk. The resulting
              surfaces gently transform throughout the day as sunlight shifts across the
              room.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-line pt-6 text-center">
            <div>
              <span className="block font-heading text-2xl text-ink md:text-3xl">
                Hand-Stretched
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted">
                Belgian Linen
              </span>
            </div>
            <div>
              <span className="block font-heading text-2xl text-ink md:text-3xl">
                Lightfast
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted">
                Mineral Pigments
              </span>
            </div>
            <div>
              <span className="block font-heading text-2xl text-ink md:text-3xl">
                Archival
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted">
                Museum Grade
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/about"
              className="inline-block border border-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Read Complete Artist CV &amp; Bio &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
