import React from 'react';
import { ContactSection } from '@/components/contact/ContactSection';
import type { Metadata } from 'next';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inquire & Private Studio Visits — Aura Vance',
  description:
    'Contact painter Aura Vance regarding original painting acquisitions, private commissions, gallery representation, or studio appointments in Hudson Valley.',
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { artwork?: string };
}) {
  const artworkParam = searchParams?.artwork || '';

  return (
    <div className="bg-paper pt-8">
      {/* Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Acquisitions &middot; Commissions &middot; Appointments
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink md:text-6xl">
            Direct Studio Contact
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
            The studio welcomes inquiries from private collectors, interior architects,
            curators, and institutions worldwide.
          </p>
        </div>
      </section>

      {/* Studio details info grid */}
      <section className="border-b border-line bg-paper px-6 py-12 md:px-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 border border-line bg-mist/20 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <MapPin className="h-4 w-4" /> Studio Address
            </div>
            <p className="font-light leading-relaxed text-ink">
              418 Warren Street, Studio 3<br />
              Hudson, NY 12534, USA
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Clock className="h-4 w-4" /> Private Viewings
            </div>
            <p className="font-light leading-relaxed text-ink">
              By appointment only
              <br />
              Thursday &ndash; Saturday, 11am &ndash; 5pm
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Mail className="h-4 w-4" /> Direct Email
            </div>
            <p className="font-light leading-relaxed text-ink">
              studio@auravance.art
              <br />
              acquisitions@auravance.art
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Phone className="h-4 w-4" /> Studio Line
            </div>
            <p className="font-light leading-relaxed text-ink">
              +1 (518) 828-0914
              <br />
              Direct assistant hours: 9am &ndash; 4pm EST
            </p>
          </div>
        </div>
      </section>

      {/* Main Inquiry Form */}
      <ContactSection initialArtworkTitle={artworkParam} />
    </div>
  );
}
