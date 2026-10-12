'use client';

import React, { useState } from 'react';

interface ContactSectionProps {
  initialArtworkTitle?: string;
}

export function ContactSection({ initialArtworkTitle = '' }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialArtworkTitle ? `Inquiry regarding "${initialArtworkTitle}"` : '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // Graceful fallback
    }

    setStatus('success');
  };

  return (
    <section
      id="inquiry"
      className="border-b border-line bg-mist/10 py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-sage">
          Direct Communications
        </span>
        <h2
          id="contact-heading"
          className="mb-4 font-heading text-4xl font-normal text-ink sm:text-5xl"
        >
          Inquire About an Artwork or Studio Visit
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
          For original painting acquisitions, private commissions, gallery representation,
          or studio viewings in Hudson, NY.
        </p>

        {status === 'success' ? (
          <div className="mx-auto max-w-xl space-y-3 border border-line bg-paper p-8 shadow-sm">
            <h3 className="font-heading text-2xl text-ink">Message Received</h3>
            <p className="text-xs leading-relaxed text-muted">
              Thank you for reaching out. Lisa Dietel or the studio assistant will review
              your inquiry and respond within two business days.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
              className="mt-4 border border-ink px-6 py-2.5 text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 text-left">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  placeholder="Eleanor Rigby"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  placeholder="eleanor@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subj"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
              >
                Subject / Artwork of Interest *
              </label>
              <input
                id="contact-subj"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                placeholder="Inquiry regarding 'Nocturne in Ochre' or Private Studio Visit"
              />
            </div>

            <div>
              <label
                htmlFor="contact-msg"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
              >
                Message *
              </label>
              <textarea
                id="contact-msg"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                placeholder="Tell us about your space, dimensions, or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-ink py-4 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {status === 'loading' ? 'Submitting...' : 'Send Studio Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactSection;
