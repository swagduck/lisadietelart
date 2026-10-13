'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IInquiry } from '@/types/artwork';
import { formatDate } from '@/lib/format';

interface InquiriesListProps {
  inquiries: IInquiry[];
  loading: boolean;
  onDeleteInquiry: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function InquiriesList({
  inquiries,
  loading,
  onDeleteInquiry,
  onRefresh,
}: InquiriesListProps) {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    const q = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.artworkSlug && inq.artworkSlug.toLowerCase().includes(q)) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this collector inquiry?')) return;
    try {
      setDeletingId(id);
      await onDeleteInquiry(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search & Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collector name, email, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage min-h-[44px]"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-paper border border-line text-xs font-medium text-muted hover:text-ink transition-colors flex items-center justify-center gap-2 min-h-[44px]"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Inquiry Cards List */}
      {loading && inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-line">
          <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted">Loading inquiries from collectors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-line">
          <span className="text-3xl block mb-2">✉️</span>
          <h3 className="font-serif text-lg text-ink font-normal">
            {search ? 'No matching inquiries found' : 'No inquiries yet'}
          </h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            {search
              ? 'Try adjusting your search keywords.'
              : 'When collectors send questions through artwork pages or the commissions form, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const inqId = (item as any).id || item._id;
            const dateStr = item.createdAt
              ? formatDate(new Date(item.createdAt))
              : 'Recent';

            return (
              <div
                key={inqId || item.email + item.message.slice(0, 10)}
                className="bg-white rounded-2xl border border-line p-4 sm:p-5 shadow-sm space-y-3"
              >
                {/* Header: Collector Info & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-line/60">
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-medium text-ink">
                      {item.name}
                    </h4>
                    <a
                      href={`mailto:${item.email}?subject=Lisa%20Dietel%20Studio%20-%20Re:%20Artwork%20Inquiry`}
                      className="text-xs text-sage hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{item.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {item.artworkSlug && (
                      <Link
                        href={`/artwork/${item.artworkSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] px-2 py-0.5 rounded-full bg-paper border border-line text-muted hover:text-ink font-mono"
                      >
                        Piece: {item.artworkSlug} ↗
                      </Link>
                    )}
                    <span className="text-[11px] text-muted/80">{dateStr}</span>
                  </div>
                </div>

                {/* Message Quote */}
                <div className="bg-paper/50 rounded-xl p-3.5 border border-line/40 text-sm text-ink/90 whitespace-pre-wrap leading-relaxed font-sans">
                  {item.message}
                </div>

                {/* Bottom Actions: Reply mailto & Delete */}
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`mailto:${item.email}?subject=Regarding%20your%20inquiry%20-%20Lisa%20Dietel%20Studio`}
                    className="px-3.5 py-2 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-medium transition-all inline-flex items-center gap-1.5 min-h-[40px]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>Reply via Email</span>
                  </a>

                  {inqId && (
                    <button
                      type="button"
                      onClick={() => handleDelete(inqId)}
                      disabled={deletingId === inqId}
                      className="px-3 py-2 rounded-xl text-xs text-muted hover:text-red-700 hover:bg-red-50 transition-colors min-h-[40px] flex items-center gap-1"
                      title="Delete inquiry"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
