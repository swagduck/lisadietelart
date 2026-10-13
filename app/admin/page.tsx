'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IArtwork, IInquiry, ISubscriber } from '@/types/artwork';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArtworkCard } from '@/components/admin/ArtworkCard';
import { InquiriesList } from '@/components/admin/InquiriesList';
import { SubscribersList } from '@/components/admin/SubscribersList';
import {
  Palette,
  Check,
  X,
  Plus,
  Search,
  Undo2,
  Sparkles,
} from 'lucide-react';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  undoAction?: () => void;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'artworks' | 'inquiries' | 'subscribers'>('artworks');

  // Data states
  const [artworks, setArtworks] = useState<IArtwork[]>([]);
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);

  // Loading states
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // Artwork Filter states
  const [artFilter, setArtFilter] = useState<'all' | 'original' | 'print' | 'available' | 'sold' | 'featured'>('all');
  const [artSearch, setArtSearch] = useState('');

  // Toast notification with Undo support
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    undoAction?: () => void
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    const toastId = `${Date.now()}-${Math.random()}`;
    setToast({ id: toastId, message, type, undoAction });

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 5500);
  };

  const handleDismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
  };

  // Fetch Artworks
  const fetchArtworks = useCallback(async () => {
    try {
      setLoadingArtworks(true);
      const res = await fetch('/api/artworks');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setArtworks(data.data);
      }
    } catch {
      showToast('Unable to load artworks.', 'error');
    } finally {
      setLoadingArtworks(false);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setInquiries(data.data);
      }
    } catch {
      showToast('Unable to load inquiries.', 'error');
    } finally {
      setLoadingInquiries(false);
    }
  }, []);

  // Fetch Subscribers
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoadingSubscribers(true);
      const res = await fetch('/api/admin/subscribers');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSubscribers(data.data);
      }
    } catch {
      showToast('Unable to load subscribers.', 'error');
    } finally {
      setLoadingSubscribers(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchArtworks();
    fetchInquiries();
    fetchSubscribers();
  }, [fetchArtworks, fetchInquiries, fetchSubscribers]);

  // Handle Sold Toggle with Optimistic UI & Undo Toast
  const handleToggleSold = async (slug: string, currentSold: boolean) => {
    const newSold = !currentSold;
    const targetArtwork = artworks.find((a) => a.slug === slug);
    const title = targetArtwork?.title || slug;

    // 1. Optimistic local update
    setArtworks((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, sold: newSold, isSoldOut: newSold } : item
      )
    );

    // 2. Undo callback definition
    const undoAction = async () => {
      // Revert in state
      setArtworks((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, sold: currentSold, isSoldOut: currentSold } : item
        )
      );
      // Revert in backend
      try {
        await fetch('/api/artworks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, sold: currentSold }),
        });
        showToast(`Undone: "${title}" status restored.`);
      } catch {
        showToast('Failed to revert status.', 'error');
      }
    };

    // 3. Show undo toast immediately
    showToast(
      newSold ? `"${title}" marked as sold out.` : `"${title}" marked as available.`,
      'success',
      undoAction
    );

    // 4. Send network request
    try {
      const res = await fetch('/api/artworks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, sold: newSold }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error);
      }
    } catch {
      // Revert if network failed
      setArtworks((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, sold: currentSold, isSoldOut: currentSold } : item
        )
      );
      showToast('Failed to update sold status', 'error');
    }
  };

  // Handle Featured Toggle with Optimistic UI & Undo Toast
  const handleToggleFeatured = async (slug: string, currentFeatured: boolean) => {
    const newFeatured = !currentFeatured;
    const targetArtwork = artworks.find((a) => a.slug === slug);
    const title = targetArtwork?.title || slug;

    // 1. Optimistic update
    setArtworks((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, featured: newFeatured } : item
      )
    );

    // 2. Undo callback
    const undoAction = async () => {
      setArtworks((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, featured: currentFeatured } : item
        )
      );
      try {
        await fetch('/api/artworks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, featured: currentFeatured }),
        });
        showToast(`Undone: "${title}" featured status restored.`);
      } catch {
        showToast('Failed to revert featured status.', 'error');
      }
    };

    // 3. Show undo toast
    showToast(
      newFeatured ? `"${title}" added to featured works.` : `"${title}" removed from featured.`,
      'success',
      undoAction
    );

    // 4. Send request
    try {
      const res = await fetch('/api/artworks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, featured: newFeatured }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error);
      }
    } catch {
      setArtworks((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, featured: currentFeatured } : item
        )
      );
      showToast('Failed to update featured status', 'error');
    }
  };

  // Handle Delete Artwork
  const handleDeleteArtwork = async (slug: string) => {
    try {
      const res = await fetch(`/api/artworks?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error);
      }
      setArtworks((prev) => prev.filter((a) => a.slug !== slug));
      showToast('Artwork deleted successfully');
    } catch {
      showToast('Failed to delete artwork', 'error');
    }
  };

  // Handle Mark as Read / Unread Inquiry
  const handleToggleReadInquiry = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    // Optimistic update
    setInquiries((prev) =>
      prev.map((item) =>
        (item.id || item._id) === id ? { ...item, read: nextRead } : item
      )
    );

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: nextRead }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      showToast(nextRead ? 'Inquiry marked as read' : 'Inquiry marked as unread');
    } catch {
      // Revert on error
      setInquiries((prev) =>
        prev.map((item) =>
          (item.id || item._id) === id ? { ...item, read: currentRead } : item
        )
      );
      showToast('Failed to update inquiry status', 'error');
    }
  };

  // Handle Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setInquiries((prev) => prev.filter((item: any) => (item.id || item._id) !== id));
      showToast('Inquiry removed');
    } catch {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  // Handle Delete Subscriber
  const handleDeleteSubscriber = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subscribers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setSubscribers((prev) => prev.filter((item: any) => (item.id || item._id) !== id));
      showToast('Subscriber removed');
    } catch {
      showToast('Failed to delete subscriber', 'error');
    }
  };

  // Filtered artworks
  const filteredArtworks = artworks.filter((item) => {
    const q = artSearch.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.medium.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (artFilter === 'original') return item.type === 'original';
    if (artFilter === 'print') return item.type === 'print';
    if (artFilter === 'available') return !item.sold && !item.isSoldOut;
    if (artFilter === 'sold') return Boolean(item.sold || item.isSoldOut);
    if (artFilter === 'featured') return Boolean(item.featured);

    return true;
  });

  const unreadInquiriesCount = inquiries.filter((inq) => !inq.read).length;

  return (
    <div className="min-h-screen bg-paper pb-32 sm:pb-20">
      {/* Top Header & Mobile Navigation Tabs */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        artworksCount={artworks.length}
        inquiriesCount={inquiries.length}
        unreadInquiriesCount={unreadInquiriesCount}
        subscribersCount={subscribers.length}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Floating Toast Alert with Undo Capability */}
        {toast && (
          <div
            role="status"
            className="fixed bottom-20 sm:bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 transition-all animate-slideUp sm:animate-fadeIn border bg-ink text-paper border-ink/40 max-w-md"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'error' ? (
                <X className="h-4 w-4 text-red-300 shrink-0" />
              ) : (
                <Check className="h-4 w-4 text-sage shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium truncate">
                {toast.message}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undoAction?.();
                    handleDismissToast();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  <span>Undo</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDismissToast}
                className="p-1 rounded-lg text-paper/70 hover:text-paper"
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: ARTWORKS */}
        {activeTab === 'artworks' && (
          <div className="space-y-5">
            {/* Action Bar: Search, Filters & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={artSearch}
                  onChange={(e) => setArtSearch(e.target.value)}
                  placeholder="Search title, medium, description..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage min-h-[44px]"
                />
              </div>

              {/* Add Artwork Button -> Navigates to full-page form */}
              <Link
                href="/admin/artworks/new"
                className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 active:scale-95 text-xs font-medium tracking-wide transition-all shadow-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add artwork</span>
              </Link>
            </div>

            {/* Filter Pills (Scrollable on small mobile screens) */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
              {(
                [
                  { id: 'all', label: 'All works' },
                  { id: 'original', label: 'Originals' },
                  { id: 'print', label: 'Prints' },
                  { id: 'available', label: 'Available' },
                  { id: 'sold', label: 'Sold out' },
                  { id: 'featured', label: 'Featured' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setArtFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap min-h-[38px] ${
                    artFilter === f.id
                      ? 'bg-ink text-paper shadow-sm'
                      : 'bg-white text-muted hover:text-ink border border-line'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Artworks List Grid */}
            {loadingArtworks && artworks.length === 0 ? (
              // Skeletons while loading artworks
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-line p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-line/80 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-line/80 rounded" />
                        <div className="h-3 w-24 bg-line/60 rounded" />
                        <div className="h-3 w-20 bg-line/50 rounded" />
                        <div className="h-4 w-16 bg-line/70 rounded mt-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line/60">
                      <div className="h-10 bg-line/60 rounded-xl" />
                      <div className="h-10 bg-line/60 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="text-center py-20 px-4 bg-white rounded-2xl border border-line">
                <Palette className="h-8 w-8 text-sage mx-auto mb-2" strokeWidth={1.5} />
                <h3 className="font-heading text-lg text-ink font-normal">
                  {artSearch || artFilter !== 'all' ? 'No matching artworks' : 'No artworks in catalog'}
                </h3>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto mb-4">
                  {artSearch || artFilter !== 'all'
                    ? 'Try clearing filters or search terms.'
                    : 'Click Add Artwork to create your first studio painting or print.'}
                </p>
                <Link
                  href="/admin/artworks/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add artwork</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.slug}
                    artwork={artwork}
                    onDelete={handleDeleteArtwork}
                    onToggleSold={handleToggleSold}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <InquiriesList
            inquiries={inquiries}
            loading={loadingInquiries}
            onDeleteInquiry={handleDeleteInquiry}
            onToggleReadInquiry={handleToggleReadInquiry}
            onRefresh={fetchInquiries}
          />
        )}

        {/* TAB 3: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <SubscribersList
            subscribers={subscribers}
            loading={loadingSubscribers}
            onDeleteSubscriber={handleDeleteSubscriber}
            onRefresh={fetchSubscribers}
          />
        )}
      </main>

      {/* Floating Action Button (Mobile view "+ Add Artwork" linking to /admin/artworks/new) */}
      {activeTab === 'artworks' && (
        <div className="sm:hidden fixed bottom-6 right-6 z-30">
          <Link
            href="/admin/artworks/new"
            aria-label="Add new artwork"
            className="w-14 h-14 rounded-full bg-ink text-paper shadow-xl hover:bg-ink/90 active:scale-95 flex items-center justify-center border border-white/20 transition-all"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}
