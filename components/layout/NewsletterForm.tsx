'use client';

import React, { useState } from 'react';

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
    <div aria-live="polite">
      {subscribed ? (
        <div className="mx-auto max-w-md border border-line bg-mist/60 p-4 text-xs uppercase tracking-widest text-sage">
          Thank you. You have been added to Lisa Dietel&apos;s private collector roster.
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="mx-auto flex max-w-md flex-col gap-2 pt-2 sm:flex-row"
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
            className="flex-1 border border-line bg-paper px-4 py-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          />
          <button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap bg-ink px-6 py-3 text-xs font-medium uppercase tracking-widest text-paper transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Dispatch'}
          </button>
        </form>
      )}
    </div>
  );
}
