'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IInquiry } from '@/types/artwork';
import { formatDate } from '@/lib/format';
import {
  Mail,
  CheckCircle2,
  Circle,
  Trash2,
  Reply,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface InquiriesListProps {
  inquiries: IInquiry[];
  loading: boolean;
  onDeleteInquiry: (id: string) => Promise<void>;
  onToggleReadInquiry: (id: string, currentRead: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function InquiriesList({
  inquiries,
  loading,
  onDeleteInquiry,
  onToggleReadInquiry,
  onRefresh,
}: InquiriesListProps) {
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [updatingReadId, setUpdatingReadId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    // Read filter
    const isRead = Boolean(inq.read);
    if (filterRead === 'unread' && isRead) return false;
    if (filterRead === 'read' && !isRead) return false;

    // Search query
    const q = search.toLowerCase();
    return (
      !q ||
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.artworkSlug && inq.artworkSlug.toLowerCase().includes(q)) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDeleteInquiry(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      setUpdatingReadId(id);
      await onToggleReadInquiry(id, currentRead);
    } finally {
      setUpdatingReadId(null);
    }
  };

  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Quick Filters & Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collector name, email, piece, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Read filter pills */}
          <div className="flex p-1 bg-white rounded-xl border border-line">
            <button
              type="button"
              onClick={() => setFilterRead('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRead === 'all'
                  ? 'bg-ink text-paper shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              All ({inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRead('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                filterRead === 'unread'
                  ? 'bg-ink text-paper shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-sage inline-block" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilterRead('read')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRead === 'read'
                  ? 'bg-ink text-paper shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Read
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-paper border border-line text-xs font-medium text-muted hover:text-ink transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            title="Refresh inquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Inquiry Cards List */}
      {loading && inquiries.length === 0 ? (
        // Skeletons while loading
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-line p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-line/80 rounded" />
                  <div className="h-3 w-56 bg-line/60 rounded" />
                </div>
                <div className="h-3 w-20 bg-line/60 rounded" />
              </div>
              <div className="h-14 bg-paper rounded-xl" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-9 w-32 bg-line/70 rounded-xl" />
                <div className="h-9 w-24 bg-line/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-line">
          <Mail className="h-8 w-8 text-sage mx-auto mb-2" strokeWidth={1.5} />
          <h3 className="font-heading text-lg text-ink font-normal">
            {search || filterRead !== 'all' ? 'No matching inquiries' : 'No inquiries yet'}
          </h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            {search || filterRead !== 'all'
              ? 'Try adjusting your search terms or filter selection.'
              : 'When collectors send questions through artwork pages or the commissions form, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const inqId = item.id || item._id || '';
            const isRead = Boolean(item.read);
            const dateStr = item.createdAt
              ? formatDate(new Date(item.createdAt))
              : 'Recent';

            const mailtoSubject = item.artworkSlug
              ? `Lisa Dietel Studio - Regarding "${item.artworkSlug}"`
              : 'Lisa Dietel Studio - Regarding your inquiry';

            return (
              <div
                key={inqId || item.email + item.message.slice(0, 10)}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-sm space-y-3.5 ${
                  isRead
                    ? 'border-line'
                    : 'border-sage/50 ring-1 ring-sage/20 bg-gradient-to-br from-mist/20 to-white'
                }`}
              >
                {/* Header: Collector Info, New Badge & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-line/60">
                  <div className="flex items-start gap-2.5">
                    {!isRead ? (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-sage mt-1.5 shrink-0 animate-pulse"
                        title="Unread inquiry"
                      />
                    ) : (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-line mt-1.5 shrink-0"
                        title="Read inquiry"
                      />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-base sm:text-lg font-medium text-ink leading-tight">
                          {item.name}
                        </h4>
                        {!isRead && (
                          <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-sage/15 text-sage">
                            New
                          </span>
                        )}
                      </div>

                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(mailtoSubject)}`}
                        className="text-xs text-sage hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{item.email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {item.artworkSlug && (
                      <Link
                        href={`/artwork/${item.artworkSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] px-2.5 py-1 rounded-full bg-paper border border-line text-muted hover:text-ink font-mono flex items-center gap-1"
                      >
                        <span>Piece: {item.artworkSlug}</span>
                        <ExternalLink className="w-3 h-3 text-sage" />
                      </Link>
                    )}
                    <span className="text-[11px] text-muted/80">{dateStr}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-paper/50 rounded-xl p-3.5 border border-line/40 text-sm text-ink/90 whitespace-pre-wrap leading-relaxed font-sans">
                  {item.message}
                </div>

                {/* Bottom Action Bar: One-Tap Reply, Mark as Read toggle, Delete confirmation */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {/* One-Tap Reply button */}
                  <a
                    href={`mailto:${item.email}?subject=${encodeURIComponent(mailtoSubject)}`}
                    className="px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-medium transition-all inline-flex items-center gap-2 min-h-[42px] active:scale-[0.98]"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>One-tap reply</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {/* Mark as read / unread toggle */}
                    {inqId && (
                      <button
                        type="button"
                        onClick={() => handleToggleRead(inqId, isRead)}
                        disabled={updatingReadId === inqId}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all min-h-[42px] flex items-center gap-1.5 ${
                          isRead
                            ? 'bg-paper text-muted hover:text-ink border-line'
                            : 'bg-sage/10 text-sage hover:bg-sage/20 border-sage/30'
                        }`}
                      >
                        {isRead ? (
                          <>
                            <Circle className="w-3.5 h-3.5 text-muted" />
                            <span className="hidden sm:inline">Mark unread</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                            <span>Mark read</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Delete with confirmation dialog */}
                    {inqId && (
                      confirmDeleteId === inqId ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => handleDelete(inqId)}
                            disabled={deletingId === inqId}
                            className="px-3 py-2 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-all min-h-[42px]"
                          >
                            {deletingId === inqId ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-2 rounded-xl text-xs text-muted hover:text-ink bg-paper border border-line transition-all min-h-[42px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(inqId)}
                          className="p-2.5 text-muted/80 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all min-w-[42px] min-h-[42px] flex items-center justify-center"
                          title="Delete inquiry"
                          aria-label="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
