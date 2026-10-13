'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IArtwork, ArtworkType } from '@/types/artwork';

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: IArtwork | null; // null for create mode
  onSaved: (savedArtwork: IArtwork) => void;
}

export function ArtworkModal({
  isOpen,
  onClose,
  artwork,
  onSaved,
}: ArtworkModalProps) {
  const isEditing = Boolean(artwork);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [type, setType] = useState<ArtworkType>('original');
  const [medium, setMedium] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState<number | ''>(1200);
  const [currency] = useState('USD');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sold, setSold] = useState(false);
  const [featured, setFeatured] = useState(false);

  // UI state
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when artwork changes or modal opens
  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title || '');
      setSlug(artwork.slug || '');
      setSlugManuallyEdited(true);
      setType(artwork.type || 'original');
      setMedium(artwork.medium || '');
      setSize(artwork.size || artwork.dimensions || '');
      setPrice(artwork.price ?? 1200);
      setDescription(artwork.description || '');
      const initialImages = artwork.images && artwork.images.length > 0
        ? [...artwork.images]
        : artwork.imageUrl ? [artwork.imageUrl] : [];
      setImages(initialImages);
      setSold(Boolean(artwork.sold || artwork.isSoldOut));
      setFeatured(Boolean(artwork.featured));
    } else {
      // Defaults for new artwork
      setTitle('');
      setSlug('');
      setSlugManuallyEdited(false);
      setType('original');
      setMedium('Oil on linen');
      setSize('60 × 80 cm');
      setPrice(1400);
      setDescription('');
      setImages([]);
      setSold(false);
      setFeatured(false);
    }
    setError(null);
  }, [artwork, isOpen]);

  // Auto-slugify when title changes in create mode
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited && !isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Image file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to upload image. Please try again.');
        return;
      }

      setImages((prev) => [...prev, data.url]);
    } catch {
      setError('Network error uploading image.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Manual image URL add
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Remove image from list
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set as primary image (move to front)
  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title.trim()) {
      setError('Artwork title is required.');
      return;
    }
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    if (!cleanSlug) {
      setError('A valid slug is required.');
      return;
    }
    if (price === '' || price < 0) {
      setError('Please provide a valid positive price.');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one image or enter an image URL.');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: cleanSlug,
      type,
      medium: medium.trim(),
      size: size.trim(),
      price: Number(price),
      currency,
      description: description.trim() || `${title} by Lisa Dietel.`,
      images,
      sold,
      featured,
    };

    try {
      setSubmitting(true);
      const url = isEditing ? `/api/artworks` : `/api/artworks`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...payload, slug: artwork!.slug, newSlug: cleanSlug } : payload),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setError(resData.error || 'Unable to save artwork. Please verify your details.');
        return;
      }

      onSaved(resData.data || payload);
      onClose();
    } catch {
      setError('Unable to save artwork. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-slideUp sm:animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-modal-title"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-paper/60 sticky top-0 z-10 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted font-mono">
              {isEditing ? 'Editing Artwork' : 'New Studio Work'}
            </span>
            <h2 id="artwork-modal-title" className="font-serif text-xl sm:text-2xl text-ink font-normal leading-tight">
              {isEditing ? artwork?.title : 'Add Artwork'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-10 h-10 rounded-full bg-paper hover:bg-line border border-line flex items-center justify-center text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2">
              <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Title & Slug */}
          <div className="space-y-4">
            <div>
              <label htmlFor="art-title" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                Artwork Title *
              </label>
              <input
                id="art-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Nocturne in Ochre"
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage text-base"
              />
            </div>

            <div>
              <label htmlFor="art-slug" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                URL Slug * (lowercase-with-hyphens)
              </label>
              <div className="flex rounded-xl border border-line bg-paper/50 overflow-hidden focus-within:ring-2 focus-within:ring-sage/40 focus-within:border-sage">
                <span className="px-3 py-3 text-xs text-muted/70 font-mono shrink-0 select-none hidden sm:inline">
                  /artwork/
                </span>
                <input
                  id="art-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="nocturne-in-ochre"
                  className="w-full px-3 py-3 text-sm bg-transparent text-ink font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Type Segmented Buttons */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
              Artwork Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-paper rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setType('original')}
                className={`py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  type === 'original'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Original Painting
              </button>
              <button
                type="button"
                onClick={() => setType('print')}
                className={`py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  type === 'print'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Limited Edition Print
              </button>
            </div>
          </div>

          {/* Medium, Size & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="art-medium" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                Medium *
              </label>
              <input
                id="art-medium"
                type="text"
                required
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="Oil on linen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
              />
            </div>

            <div>
              <label htmlFor="art-size" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                Dimensions / Size *
              </label>
              <input
                id="art-size"
                type="text"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="60 × 80 cm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
              />
            </div>

            <div>
              <label htmlFor="art-price" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                Price (USD $) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">$</span>
                <input
                  id="art-price"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1400"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-line bg-paper/30 text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3 pt-2 border-t border-line/60">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-muted font-medium">
                Artwork Images * ({images.length})
              </label>
              <span className="text-[11px] text-muted font-mono">
                First image is primary display
              </span>
            </div>

            {/* Upload Action */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="artwork-file-upload"
              />

              <label
                htmlFor="artwork-file-upload"
                className={`flex-1 min-h-[46px] px-4 py-2.5 rounded-xl border border-dashed border-sage/60 bg-sage/5 hover:bg-sage/10 text-sage font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] ${
                  uploadingImage ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {uploadingImage ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Uploading photo...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Upload from Phone Camera or Gallery</span>
                  </>
                )}
              </label>
            </div>

            {/* Direct URL Input fallback */}
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image link (e.g. https://... or /images/...)"
                className="flex-1 px-3 py-2 rounded-xl border border-line bg-paper/30 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-sage"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrlInput.trim()}
                className="px-3 py-2 rounded-xl bg-paper hover:bg-line border border-line text-xs font-medium text-ink transition-colors disabled:opacity-50 min-h-[38px]"
              >
                Add URL
              </button>
            </div>

            {/* Images Preview List */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, index) => (
                  <div
                    key={`${imgUrl}-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-line bg-paper aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`Artwork preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/nocturne-in-ochre.svg';
                      }}
                    />

                    {/* Primary Badge */}
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-ink/90 text-paper text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded shadow">
                        Primary
                      </span>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="p-1.5 rounded-lg bg-white text-ink text-[10px] font-medium hover:bg-paper"
                          title="Set as primary"
                        >
                          Make 1st
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        title="Remove image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="art-desc" className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
              Artwork Description
            </label>
            <textarea
              id="art-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mood, technique, pigments, and framing details..."
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage resize-y"
            />
          </div>

          {/* Checkboxes: Sold & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line/60">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-line hover:bg-paper/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={sold}
                onChange={(e) => setSold(e.target.checked)}
                className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
              />
              <div>
                <span className="block text-xs font-medium text-ink">Mark as Sold Out</span>
                <span className="block text-[11px] text-muted">Prevents inquiries and marks piece as acquired</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-line hover:bg-paper/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
              />
              <div>
                <span className="block text-xs font-medium text-ink">Feature on Homepage</span>
                <span className="block text-[11px] text-muted">Highlights piece in the Selected Works showcase</span>
              </div>
            </label>
          </div>

          {/* Sticky Actions Footer */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-3 rounded-xl border border-line bg-paper hover:bg-line text-xs font-medium text-muted hover:text-ink transition-all min-h-[46px]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-3 rounded-xl bg-ink text-paper font-medium text-xs tracking-wide hover:bg-ink/90 active:scale-[0.99] transition-all disabled:opacity-50 min-h-[46px] flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-paper" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Artwork'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
