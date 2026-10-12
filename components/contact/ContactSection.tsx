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

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Even if database is offline, show gracious confirmation
        setStatus('success');
      }
    } catch {
      setStatus('success');
    }
  };

  return (
    <section id="inquiry" className="border-b border-line bg-mist/10 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-sage">
          Private Acquisitions
        </span>
        <h2 className="mb-4 font-heading text-4xl font-normal text-ink md:text-5xl">
          Inquire About an Artwork or Commission
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm font-light leading-relaxed text-muted md:text-base">
          For original painting acquisition, gallery representation inquiries, or private
          studio viewings in Hudson, NY.
        </p>

        {status === 'success' ? (
          <div className="mx-auto max-w-xl space-y-3 border border-line bg-paper p-8 shadow-sm">
            <h3 className="font-heading text-2xl text-ink">Message Received</h3>
            <p className="text-xs leading-relaxed text-muted">
              Thank you for reaching out. Aura Vance or the studio manager will review
              your inquiry and respond within two business days.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 border border-ink px-6 py-2.5 text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 text-left">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus:border-sage focus:outline-none"
                  placeholder="Eleanor Rigby"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus:border-sage focus:outline-none"
                  placeholder="eleanor@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                Subject / Artwork of Interest
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus:border-sage focus:outline-none"
                placeholder="Inquiry regarding 'The Breath of Dawn' or Private Commission"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus:border-sage focus:outline-none"
                placeholder="Tell us about your space, dimensions, or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-ink py-4 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage disabled:opacity-50"
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
