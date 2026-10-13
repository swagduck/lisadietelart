'use client';

import React, { useState } from 'react';
import { ISubscriber } from '@/types/artwork';
import { formatDate } from '@/lib/format';
import { Users, Download, RefreshCw, Trash2, Search } from 'lucide-react';

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDeleteSubscriber(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
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
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
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
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-medium transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 active:scale-95 shadow-sm"
            title="Download subscribers as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-paper border border-line text-xs font-medium text-muted hover:text-ink transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            title="Refresh subscribers list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* List Container */}
      {loading && subscribers.length === 0 ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between animate-pulse"
            >
              <div className="h-4 w-48 bg-line/80 rounded" />
              <div className="h-4 w-24 bg-line/50 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-line">
          <Users className="h-8 w-8 text-sage mx-auto mb-2" strokeWidth={1.5} />
          <h3 className="font-heading text-lg text-ink font-normal">
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
                  confirmDeleteId === subId ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => handleDelete(subId)}
                        disabled={deletingId === subId}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-all min-h-[36px]"
                      >
                        {deletingId === subId ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1.5 rounded-lg text-xs text-muted hover:text-ink bg-paper border border-line transition-all min-h-[36px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(subId)}
                      className="p-2 text-muted/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Remove subscriber"
                      aria-label="Remove subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
