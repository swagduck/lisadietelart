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
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus('loading');

    try {
      const fullMessage = formData.subject
        ? `[Subject: ${formData.subject}]\n\n${formData.message}`
        : formData.message;

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: fullMessage,
          artworkSlug: initialArtworkTitle || undefined,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send inquiry. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
      setStatus('idle');
    }
  };

  return (
    <section
      id="inquiry"
      className="border-b border-line bg-mist/10 py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <span className="mb-2 block text-xs font-medium tracking-wide text-sage">
          Direct communications
        </span>
        <h2
          id="contact-heading"
          className="mb-4 font-heading text-4xl font-normal text-ink sm:text-5xl"
        >
          Inquire About an Artwork or Studio Visit
        </h2>
        <p className="mx-auto mb-10 max-w-[65ch] text-sm font-light leading-relaxed text-muted md:text-base">
          For original painting acquisitions, private commissions, gallery representation,
          or studio viewings in Hudson, NY.
        </p>

        <div aria-live="polite">
          {status === 'success' ? (
            <div className="mx-auto max-w-xl space-y-3 border border-line bg-paper p-8 animate-in fade-in duration-300 motion-reduce:animate-none">
              <h3 className="font-heading text-2xl text-ink">Message received</h3>
              <p className="text-xs leading-relaxed text-muted">
                Thank you for reaching out. Lisa Dietel or the studio assistant will review
                your inquiry and respond within two business days.
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
                }}
                className="mt-4 border border-ink px-6 py-2.5 text-xs text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 text-left">
              {errorMessage && (
                <div
                  role="alert"
                  className="border border-red-200 bg-red-50/80 p-4 text-xs font-normal text-red-800 animate-error-shake"
                >
                  {errorMessage}
                </div>
              )}
              {/* Honeypot field for bot protection */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-xs font-medium text-muted"
                >
                  Your name *
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
                  className="mb-1 block text-xs font-medium text-muted"
                >
                  Email address *
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
                className="mb-1 block text-xs font-medium text-muted"
              >
                Subject / Artwork of interest *
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
                className="mb-1 block text-xs font-medium text-muted"
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
              className="w-full bg-ink py-4 text-xs font-medium text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {status === 'loading' ? 'Submitting...' : 'Send studio message'}
            </button>
          </form>
        )}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
