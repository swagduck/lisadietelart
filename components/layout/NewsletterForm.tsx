'use client';

import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot }),
      });
      setSubscribed(true);
      setEmail('');
      setHoneypot('');
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite" className="mx-auto max-w-md pt-2">
      {subscribed ? (
        <div className="flex items-center justify-center gap-2 border border-line bg-mist/40 p-4 text-xs font-normal text-sage transition-all animate-in fade-in duration-300">
          <Check className="h-4 w-4 text-sage" />
          <span>You have been added to Lisa Dietel&apos;s private collector roster.</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col gap-2 sm:flex-row"
        >
          {/* Honeypot field for bot protection */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <label htmlFor="newsletter-email" className="sr-only">
            Email address for studio newsletter
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collector@example.com"
            className="flex-1 border border-line bg-paper px-4 py-3 text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap bg-ink px-6 py-3 text-xs font-normal text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <span>{loading ? 'Joining...' : 'Join dispatch'}</span>
            {!loading && <ArrowRight className="h-3 w-3" />}
          </button>
        </form>
      )}
    </div>
  );
}

export default NewsletterForm;
