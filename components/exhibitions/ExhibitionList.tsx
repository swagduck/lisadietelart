import React from 'react';
import { EXHIBITIONS_DATA } from '@/lib/data';
import { IExhibition } from '@/types/inquiry';

interface ExhibitionListProps {
  exhibitions?: IExhibition[];
}

export function ExhibitionList({ exhibitions = EXHIBITIONS_DATA }: ExhibitionListProps) {
  return (
    <section id="exhibitions" className="border-b border-line bg-paper py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 max-w-2xl">
          <span className="mb-2 block text-xs font-medium tracking-wide text-sage">
            Exhibitions &middot; CV
          </span>
          <h2 className="font-heading text-4xl font-normal text-ink md:text-5xl">
            Selected Solo &amp; Group Exhibitions
          </h2>
        </div>

        <div className="divide-y border-y border-line text-sm">
          {exhibitions.map((ex, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 items-baseline gap-3 px-2 py-6 transition-colors duration-150 hover:bg-mist/20 md:grid-cols-12 md:gap-2"
            >
              <span className="text-xs font-light text-muted md:col-span-2">
                {ex.year}
              </span>
              <div className="md:col-span-5">
                <span className="block font-heading text-xl text-ink md:text-2xl">
                  {ex.title}
                </span>
                <span className="text-xs font-light text-muted">{ex.type}</span>
              </div>
              <span className="text-xs font-light text-muted md:col-span-3 md:text-sm">
                {ex.venue}
              </span>
              <span className="text-xs font-medium text-sage md:col-span-2 md:text-right">
                {ex.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExhibitionList;
