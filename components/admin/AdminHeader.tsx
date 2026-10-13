'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  activeTab: 'artworks' | 'inquiries' | 'subscribers';
  setActiveTab: (tab: 'artworks' | 'inquiries' | 'subscribers') => void;
  artworksCount: number;
  inquiriesCount: number;
  subscribersCount: number;
}

export function AdminHeader({
  activeTab,
  setActiveTab,
  artworksCount,
  inquiriesCount,
  subscribersCount,
}: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Bar: Brand, Site Link, Logout */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="group">
              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-muted group-hover:text-ink transition-colors font-medium">
                Studio Administration
              </span>
              <span className="font-serif text-xl sm:text-2xl text-ink font-normal tracking-tight">
                Lisa Dietel
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-ink px-3 py-2 rounded-lg border border-line bg-white/50 hover:bg-white transition-all flex items-center gap-1.5 min-h-[38px]"
              title="Open public website in a new tab"
            >
              <span>View Site</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100/80 px-3.5 py-2 rounded-lg border border-red-200 transition-all flex items-center gap-1.5 min-h-[38px] active:scale-95 disabled:opacity-50"
            >
              {loggingOut ? (
                <span>Leaving...</span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile-Friendly Tabs Navigation */}
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <button
            onClick={() => setActiveTab('artworks')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'artworks'
                ? 'bg-ink text-paper shadow-sm'
                : 'text-muted hover:text-ink hover:bg-white/60'
            }`}
          >
            <span>🎨 Artworks</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'artworks' ? 'bg-white/20 text-paper' : 'bg-line text-muted'
              }`}
            >
              {artworksCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'inquiries'
                ? 'bg-ink text-paper shadow-sm'
                : 'text-muted hover:text-ink hover:bg-white/60'
            }`}
          >
            <span>✉️ Inquiries</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'inquiries' ? 'bg-white/20 text-paper' : 'bg-line text-muted'
              }`}
            >
              {inquiriesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'subscribers'
                ? 'bg-ink text-paper shadow-sm'
                : 'text-muted hover:text-ink hover:bg-white/60'
            }`}
          >
            <span>👥 Subscribers</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'subscribers' ? 'bg-white/20 text-paper' : 'bg-line text-muted'
              }`}
            >
              {subscribersCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
