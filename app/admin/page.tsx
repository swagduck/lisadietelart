'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IArtwork, IInquiry, ISubscriber } from '@/types/artwork';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArtworkCard } from '@/components/admin/ArtworkCard';
import { ArtworkModal } from '@/components/admin/ArtworkModal';
import { InquiriesList } from '@/components/admin/InquiriesList';
import { SubscribersList } from '@/components/admin/SubscribersList';
import { Palette, Check, X } from 'lucide-react';

export default function AdminDashboardPage() {
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

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<IArtwork | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
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

  // Handle Sold Toggle
  const handleToggleSold = async (slug: string, currentSold: boolean) => {
    const newSold = !currentSold;
    // Optimistic update
    setArtworks((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, sold: newSold, isSoldOut: newSold } : item
      )
    );

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
      showToast(newSold ? 'Marked as Sold Out' : 'Marked as Available');
    } catch {
      // Revert optimistic update
      setArtworks((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, sold: currentSold, isSoldOut: currentSold } : item
        )
      );
      showToast('Failed to update sold status', 'error');
    }
  };

  // Handle Featured Toggle
  const handleToggleFeatured = async (slug: string, currentFeatured: boolean) => {
    const newFeatured = !currentFeatured;
    // Optimistic update
    setArtworks((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, featured: newFeatured } : item
      )
    );

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
      showToast(newFeatured ? 'Added to Featured works' : 'Removed from Featured');
    } catch {
      // Revert
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

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingArtwork(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (art: IArtwork) => {
    setEditingArtwork(art);
    setModalOpen(true);
  };

  // Filtered artworks
  const filteredArtworks = artworks.filter((item) => {
    // Search query
    const q = artSearch.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.medium.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (artFilter === 'original') return item.type === 'original';
    if (artFilter === 'print') return item.type === 'print';
    if (artFilter === 'available') return !item.sold && !item.isSoldOut;
    if (artFilter === 'sold') return Boolean(item.sold || item.isSoldOut);
    if (artFilter === 'featured') return Boolean(item.featured);

    return true;
  });

  return (
    <div className="min-h-screen bg-paper pb-28 sm:pb-16">
      {/* Top Header & Mobile Tab Bar */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        artworksCount={artworks.length}
        inquiriesCount={inquiries.length}
        subscribersCount={subscribers.length}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Toast Alert */}
        {toast && (
          <div
            role="status"
            className={`fixed bottom-20 sm:bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 transition-all animate-slideUp sm:animate-fadeIn border ${
              toast.type === 'success'
                ? 'bg-ink text-paper border-ink/40'
                : 'bg-red-900 text-white border-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="h-4 w-4 text-sage shrink-0" />
            ) : (
              <X className="h-4 w-4 text-red-300 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
        )}

        {/* TAB 1: ARTWORKS */}
        {activeTab === 'artworks' && (
          <div className="space-y-5">
            {/* Action Bar: Search, Filters & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Field */}
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
                  value={artSearch}
                  onChange={(e) => setArtSearch(e.target.value)}
                  placeholder="Search title, medium, slug..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage min-h-[44px]"
                />
              </div>

              {/* Add Artwork Button (Desktop view) */}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 active:scale-95 text-xs font-medium tracking-wide transition-all shadow-sm min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Artwork</span>
              </button>
            </div>

            {/* Filter Pills (Scrollable on small mobile screens) */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
              {(
                [
                  { id: 'all', label: 'All Works' },
                  { id: 'original', label: 'Originals' },
                  { id: 'print', label: 'Prints' },
                  { id: 'available', label: 'Available' },
                  { id: 'sold', label: 'Sold Out' },
                  { id: 'featured', label: 'Featured ⭐' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setArtFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap min-h-[36px] ${
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
              <div className="text-center py-20 bg-white rounded-2xl border border-line">
                <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-muted">Loading studio artwork collection...</p>
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="text-center py-20 px-4 bg-white rounded-2xl border border-line">
                <Palette className="h-8 w-8 text-sage mx-auto mb-2" strokeWidth={1.5} />
                <h3 className="font-serif text-lg text-ink font-normal">
                  {artSearch || artFilter !== 'all' ? 'No matching artworks found' : 'No artworks in catalog'}
                </h3>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto mb-4">
                  {artSearch || artFilter !== 'all'
                    ? 'Try clearing filters or search terms.'
                    : 'Click Add Artwork to upload your first studio painting or print.'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-medium"
                >
                  + Add Artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.slug}
                    artwork={artwork}
                    onEdit={handleOpenEdit}
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

      {/* Floating Action Button (Mobile view "+ Add Artwork") */}
      {activeTab === 'artworks' && (
        <div className="sm:hidden fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={handleOpenCreate}
            aria-label="Add new artwork"
            className="w-14 h-14 rounded-full bg-ink text-paper shadow-lg hover:bg-ink/90 active:scale-95 flex items-center justify-center border border-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Artwork Modal (Create / Edit) */}
      <ArtworkModal
        isOpen={modalOpen}
        artwork={editingArtwork}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          fetchArtworks();
          showToast(editingArtwork ? 'Artwork updated successfully' : 'New artwork created');
        }}
      />
    </div>
  );
}
