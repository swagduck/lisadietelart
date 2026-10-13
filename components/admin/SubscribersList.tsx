'use client';

import React, { useState } from 'react';
import { ISubscriber } from '@/types/artwork';
import { formatDate } from '@/lib/format';
import { Users } from 'lucide-react';

interface SubscribersListProps {
  subscribers: ISubscriber[];
  loading: boolean;
  onDeleteSubscriber: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function SubscribersList({
  subscribers,
  loading,
  onDeleteSubscriber,
  onRefresh,
}: SubscribersListProps) {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      setDeletingId(id);
      await onDeleteSubscriber(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ['Email', 'Subscribed Date'];
    const rows = subscribers.map((sub) => [
      `"${sub.email}"`,
      `"${sub.createdAt ? new Date(sub.createdAt).toISOString() : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lisa-dietel-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Export CSV, Refresh */}
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
            placeholder="Search email address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-medium transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50"
            title="Download subscribers as CSV spreadsheet"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-paper border border-line text-xs font-medium text-muted hover:text-ink transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* List Container */}
      {loading && subscribers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-line">
          <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted">Loading newsletter subscribers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-line">
          <Users className="h-8 w-8 text-sage mx-auto mb-2" strokeWidth={1.5} />
          <h3 className="font-serif text-lg text-ink font-normal">
            {search ? 'No matching subscribers found' : 'No subscribers yet'}
          </h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            {search
              ? 'Try another email search query.'
              : 'When readers sign up for the Studio Dispatch in the footer, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm divide-y divide-line/60">
          <div className="p-3.5 bg-paper/40 flex items-center justify-between text-[11px] font-mono text-muted uppercase tracking-wider">
            <span>Email Address ({filtered.length})</span>
            <span>Date Subscribed</span>
          </div>

          {filtered.map((sub) => {
            const subId = (sub as any).id || sub._id;
            const dateStr = sub.createdAt
              ? formatDate(new Date(sub.createdAt))
              : 'Recent';

            return (
              <div
                key={subId || sub.email}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-paper/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink text-sm sm:text-base truncate">
                    {sub.email}
                  </div>
                  <div className="text-[11px] text-muted sm:hidden mt-0.5">
                    {dateStr}
                  </div>
                </div>

                <div className="hidden sm:block text-xs text-muted font-mono shrink-0">
                  {dateStr}
                </div>

                {subId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(subId)}
                    disabled={deletingId === subId}
                    className="p-2 text-muted/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Remove subscriber"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
