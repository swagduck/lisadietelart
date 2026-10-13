import React from 'react';
import Image from 'next/image';
import { CommissionForm } from '@/components/commissions/CommissionForm';
import { Palette, Compass, Layers, Truck } from 'lucide-react';
import { getCloudinaryBlurUrl } from '@/lib/cloudinary-url';

export const metadata = {
  title: 'Bespoke Art Commissions — Lisa Dietel Studio',
  description:
    'Collaborate directly with Lisa Dietel to create a custom original oil and mineral painting for your private home or architectural project.',
  openGraph: {
    title: 'Bespoke Art Commissions — Lisa Dietel Studio',
    description:
      'Collaborate directly with Lisa Dietel to create a custom original oil and mineral painting tailored to your interior space.',
    url: '/commissions',
    images: [
      {
        url: '/images/the-breath-of-dawn.svg',
        width: 1200,
        height: 630,
        alt: 'Bespoke Commissions by Lisa Dietel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bespoke Art Commissions — Lisa Dietel Studio',
    description:
      'Collaborate directly with Lisa Dietel to create a custom original oil and mineral painting.',
    images: ['/images/the-breath-of-dawn.svg'],
  },
};

export default function CommissionsPage() {
  const steps = [
    {
      step: '01',
      title: 'Initial dialogue & spatial study',
      description:
        'We begin with a conversation discussing your room proportions, wall dimensions, and ambient light exposure. You are invited to share photographs or architectural plans of the space.',
      icon: <Compass className="h-5 w-5 text-sage" />,
    },
    {
      step: '02',
      title: 'Color palette & composition studies',
      description:
        'Lisa prepares small-scale gouache and oil studies on Arches cotton paper exploring color resonance, mineral temperature, and structural horizons tailored to your interior.',
      icon: <Palette className="h-5 w-5 text-sage" />,
    },
    {
      step: '03',
      title: 'Linen preparation & painting',
      description:
        'Upon study approval, raw European flax linen is hand-stretched over custom mortise-and-tenon cedar bars. Lisa constructs the painting through deliberate translucent glazes and impasto.',
      icon: <Layers className="h-5 w-5 text-sage" />,
    },
    {
      step: '04',
      title: 'Archival curation & delivery',
      description:
        'Each finished commission is signed, catalogued, and accompanied by an embossed Certificate of Authenticity. We coordinate custom timber crating and insured white-glove transit.',
      icon: <Truck className="h-5 w-5 text-sage" />,
    },
  ];

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Editorial Header */}
      <section className="border-b border-line bg-mist/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="block text-xs font-normal text-sage">
            Private commissions &middot; Bespoke oeuvre
          </span>
          <h1 className="font-heading text-4xl font-normal text-ink sm:text-5xl md:text-6xl">
            Commission a custom painting
          </h1>
          <p className="mx-auto max-w-[65ch] text-sm font-light leading-relaxed text-muted md:text-base">
            Collaborate directly with painter Lisa Dietel to create a site-specific
            original painting tailored to the scale, light, and architectural spirit of
            your home.
          </p>
        </div>
      </section>

      {/* Process Explanation */}
      <section className="mx-auto max-w-7xl border-b border-line px-6 py-20 md:px-12">
        <div className="mb-16 max-w-2xl">
          <span className="mb-2 block text-xs font-normal text-sage">
            The method
          </span>
          <h2 className="font-heading text-4xl font-normal text-ink">
            How a private commission unfolds
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative space-y-4 border border-line bg-paper p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist/60">
                  {item.icon}
                </div>
                <span className="font-heading text-2xl font-bold text-line">
                  {item.step}
                </span>
              </div>

              <h3 className="font-heading text-xl font-medium text-ink">{item.title}</h3>

              <p className="text-xs font-light leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Image & Contact Form Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/* Left Column: Studio Photo & Particulars */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-line bg-paper p-3 shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist/40">
                <Image
                  src="/images/artist-studio.svg"
                  alt="Lisa Dietel studio workspace"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={getCloudinaryBlurUrl('/images/artist-studio.svg')}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            <div className="space-y-3 border border-line bg-mist/30 p-6 text-xs">
              <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
                Commission Particulars
              </span>
              <ul className="space-y-2 font-light leading-relaxed text-ink/80">
                <li>
                  &bull; <strong className="font-medium">Lead Time:</strong> 8 to 14 weeks
                  from study approval
                </li>
                <li>
                  &bull; <strong className="font-medium">Deposit:</strong> 50% upon study
                  agreement, 50% prior to dispatch
                </li>
                <li>
                  &bull; <strong className="font-medium">Scale:</strong> Works from 30 ×
                  40 in up to 72 × 96 in
                </li>
                <li>
                  &bull; <strong className="font-medium">Framing:</strong> Optional
                  hand-milled solid white oak or walnut tray frames
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-2">
              <span className="block text-xs font-medium uppercase tracking-[0.25em] text-sage">
                Begin the Conversation
              </span>
              <h2 className="font-heading text-3xl font-normal text-ink sm:text-4xl">
                Commission Proposal Inquiry
              </h2>
              <p className="text-xs font-light text-muted">
                Please complete the details below. Lisa will review your proposal and get
                in touch directly.
              </p>
            </div>

            <CommissionForm />
          </div>
        </div>
      </section>
    </div>
  );
}
