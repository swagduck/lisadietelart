import React from 'react';
import { ContactSection } from '@/components/contact/ContactSection';
import type { Metadata } from 'next';
import { MapPin, Mail, Clock, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Studio Appointments — Lisa Dietel Art',
  description:
    'Contact painter Lisa Dietel regarding original painting acquisitions, private commissions, gallery representation, or studio appointments.',
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { artwork?: string };
}) {
  const artworkParam = searchParams?.artwork || '';

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
            Acquisitions &middot; Inquiries &middot; Private Appointments
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
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
          <div className="space-y-2 border border-line bg-mist/20 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <MapPin className="h-4 w-4" /> Studio Address
            </div>
            <p className="font-light leading-relaxed text-ink">
              Lisa Dietel Studio
              <br />
              Warren Street Arts Quarter
              <br />
              Hudson, NY 12534
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Clock className="h-4 w-4" /> Private Viewings
            </div>
            <p className="font-light leading-relaxed text-ink">
              By appointment only
              <br />
              Wednesday &ndash; Saturday
              <br />
              11:00 am &ndash; 5:00 pm EST
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Mail className="h-4 w-4" /> Direct Email
            </div>
            <p className="font-light leading-relaxed text-ink">
              <a
                href="mailto:studio@lisadietelart.com"
                className="underline transition-colors hover:text-sage"
              >
                studio@lisadietelart.com
              </a>
            </p>
          </div>

          <div className="space-y-2 border border-line bg-mist/20 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-sage">
              <Phone className="h-4 w-4" /> Studio Telephone
            </div>
            <p className="font-light leading-relaxed text-ink">
              +1 (518) 828-0914
              <br />
              Assistant hours: 9am &ndash; 4pm EST
            </p>
          </div>
        </div>
      </section>

      {/* Main Inquiry Form */}
      <ContactSection initialArtworkTitle={artworkParam} />
    </div>
  );
}
