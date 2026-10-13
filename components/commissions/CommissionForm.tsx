'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function CommissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dimensions: '',
    budget: '',
    timeline: '',
    description: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus('submitting');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Bespoke Commission Inquiry (${formData.dimensions || 'Custom Size'})`,
          message: `Dimensions: ${formData.dimensions}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nDescription:\n${formData.description}`,
          type: 'commission',
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit commission proposal. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="space-y-4 border border-line bg-paper p-8 text-center shadow-sm animate-in fade-in duration-300 motion-reduce:animate-none">
        <CheckCircle2 className="mx-auto h-10 w-10 text-sage" />
        <h3 className="font-heading text-3xl text-ink">Inquiry Received</h3>
        <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-muted">
          Thank you, {formData.name}. Lisa Dietel reviews each bespoke commission proposal
          personally. We will reach out within two business days to schedule an initial
          consultation.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setFormData({
              name: '',
              email: '',
              dimensions: '',
              budget: '',
              timeline: '',
              description: '',
              honeypot: '',
            });
          }}
          className="mt-4 border border-ink px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border border-line bg-paper p-8 shadow-sm"
    >
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="comm-name"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Your Full Name *
          </label>
          <input
            id="comm-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Eleanor Vance"
            className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
        </div>

        <div>
          <label
            htmlFor="comm-email"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Email Address *
          </label>
          <input
            id="comm-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="eleanor@example.com"
            className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label
            htmlFor="comm-dims"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Desired Dimensions
          </label>
          <input
            id="comm-dims"
            type="text"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g. 40 × 60 in"
            className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
        </div>

        <div>
          <label
            htmlFor="comm-budget"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Estimated Budget
          </label>
          <select
            id="comm-budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <option value="">Select range...</option>
            <option value="$2,500 - $4,000">$2,500 &ndash; $4,000</option>
            <option value="$4,000 - $6,500">$4,000 &ndash; $6,500</option>
            <option value="$6,500 - $10,000">$6,500 &ndash; $10,000</option>
            <option value="$10,000+">$10,000+</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="comm-timeline"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Desired Timeline
          </label>
          <input
            id="comm-timeline"
            type="text"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            placeholder="e.g. Spring 2025"
            className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="comm-desc"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Tell us about the space, inspiration &amp; color resonance *
        </label>
        <textarea
          id="comm-desc"
          rows={5}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your room, wall dimensions, surrounding materials, natural daylight exposure, or past paintings of Lisa's that resonate with you..."
          className="w-full border border-line bg-paper px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-xs font-medium uppercase tracking-widest text-paper shadow-sm transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        <span>
          {status === 'submitting'
            ? 'Submitting Commission Inquiry...'
            : 'Submit Commission Proposal'}
        </span>
      </button>
    </form>
  );
}

export default CommissionForm;
