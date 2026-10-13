'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IArtwork, ArtworkType } from '@/types/artwork';
import { artworkInputSchema } from '@/lib/validations';
import {
  compressImage,
  uploadDirectToCloudinary,
  UploadProgressItem,
} from '@/lib/image-upload';
import {
  ArrowLeft,
  Camera,
  Upload,
  Check,
  AlertCircle,
  ExternalLink,
  Trash2,
  MoveLeft,
  MoveRight,
  Star,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface ArtworkFormProps {
  initialId?: string; // either a MongoDB _id, a slug, or 'new'
  isNew?: boolean;
}

export function ArtworkForm({ initialId, isNew = false }: ArtworkFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form Field States
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
  const [useWallMockup, setUseWallMockup] = useState(true);
  const [showInHero, setShowInHero] = useState(false);
  const [heroOrder, setHeroOrder] = useState<number | ''>('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroLabel, setHeroLabel] = useState('');

  // Initial loaded data for edit mode
  const [existingArtwork, setExistingArtwork] = useState<IArtwork | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(!isNew);

  // UI & Sync States
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedDraftAt, setLastSavedDraftAt] = useState<Date | null>(null);
  const [draftBannerVisible, setDraftBannerVisible] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgressItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const draftKey = isNew ? 'admin_draft_art_new' : `admin_draft_art_${initialId}`;

  // 1. Fetch existing artwork in edit mode
  useEffect(() => {
    if (isNew || !initialId) {
      setLoadingInitial(false);
      return;
    }

    let isMounted = true;
    async function loadArtwork() {
      try {
        setLoadingInitial(true);
        const res = await fetch(`/api/artworks/${encodeURIComponent(initialId!)}`);
        const json = await res.json();

        if (!isMounted) return;

        if (res.ok && json.success && json.data) {
          const art = json.data;
          setExistingArtwork(art);
          setTitle(art.title || '');
          setSlug(art.slug || '');
          setSlugManuallyEdited(true);
          setType(art.type || 'original');
          setMedium(art.medium || '');
          setSize(art.size || art.dimensions || '');
          setPrice(art.price ?? 1200);
          setDescription(art.description || '');
          const initialImgs =
            art.images && art.images.length > 0
              ? [...art.images]
              : art.imageUrl
              ? [art.imageUrl]
              : [];
          setImages(initialImgs);
          setSold(Boolean(art.sold || art.isSoldOut));
          setFeatured(Boolean(art.featured));
          setUseWallMockup(art.useWallMockup !== false);
          setShowInHero(Boolean(art.showInHero));
          setHeroOrder(typeof art.heroOrder === 'number' ? art.heroOrder : '');
          setHeroHeadline(art.heroHeadline || '');
          setHeroSubtitle(art.heroSubtitle || '');
          setHeroLabel(art.heroLabel || '');

          // Check if a more recent local draft exists
          try {
            const savedDraft = localStorage.getItem(draftKey);
            if (savedDraft) {
              setDraftBannerVisible(true);
            }
          } catch {
            // localStorage not available
          }
        } else {
          setErrorMessage(json.error || 'Artwork could not be loaded.');
        }
      } catch {
        if (isMounted) setErrorMessage('Failed to load artwork. Check your connection.');
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    loadArtwork();
    return () => {
      isMounted = false;
    };
  }, [initialId, isNew, draftKey]);

  // 2. Check for drafts on mount in create mode
  useEffect(() => {
    if (!isNew) return;
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setDraftBannerVisible(true);
      }
    } catch {
      // ignore
    }
  }, [isNew, draftKey]);

  // 3. Restore draft function
  const handleRestoreDraft = () => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.title !== undefined) setTitle(parsed.title);
      if (parsed.slug !== undefined) setSlug(parsed.slug);
      if (parsed.type !== undefined) setType(parsed.type);
      if (parsed.medium !== undefined) setMedium(parsed.medium);
      if (parsed.size !== undefined) setSize(parsed.size);
      if (parsed.price !== undefined) setPrice(parsed.price);
      if (parsed.description !== undefined) setDescription(parsed.description);
      if (Array.isArray(parsed.images)) setImages(parsed.images);
      if (parsed.sold !== undefined) setSold(parsed.sold);
      if (parsed.featured !== undefined) setFeatured(parsed.featured);
      if (parsed.useWallMockup !== undefined) setUseWallMockup(parsed.useWallMockup);
      if (parsed.showInHero !== undefined) setShowInHero(parsed.showInHero);
      if (parsed.heroOrder !== undefined) setHeroOrder(parsed.heroOrder);
      if (parsed.heroHeadline !== undefined) setHeroHeadline(parsed.heroHeadline);
      if (parsed.heroSubtitle !== undefined) setHeroSubtitle(parsed.heroSubtitle);
      if (parsed.heroLabel !== undefined) setHeroLabel(parsed.heroLabel);

      setIsDirty(true);
      setDraftBannerVisible(false);
      setSuccessMessage('Restored your autosaved draft.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      setErrorMessage('Could not restore draft.');
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      setDraftBannerVisible(false);
    } catch {
      // ignore
    }
  };

  // 4. Autosave draft to localStorage
  const saveDraftToStorage = useCallback(() => {
    if (!title && !medium && images.length === 0 && !description) return;
    try {
      const draft = {
        title,
        slug,
        type,
        medium,
        size,
        price,
        currency,
        description,
        images,
        sold,
        featured,
        useWallMockup,
        showInHero,
        heroOrder,
        heroHeadline,
        heroSubtitle,
        heroLabel,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setLastSavedDraftAt(new Date());
    } catch {
      // ignore storage limits
    }
  }, [title, slug, type, medium, size, price, currency, description, images, sold, featured, useWallMockup, showInHero, heroOrder, heroHeadline, heroSubtitle, heroLabel, draftKey]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      saveDraftToStorage();
    }, 1200);

    return () => clearTimeout(timer);
  }, [isDirty, saveDraftToStorage]);

  // 5. Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle title & slug auto-generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!slugManuallyEdited && isNew) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // 6. Multi-image upload with compression & direct Cloudinary upload
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);
    setIsDirty(true);

    const files = Array.from(fileList);
    const newQueueItems: UploadProgressItem[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      progress: 0,
      status: 'compressing',
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);

    // Process each image sequentially or concurrently
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = newQueueItems[i];

      try {
        // Step 1: Compress in browser (max 2400px, 85% JPEG)
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'compressing', progress: 15 } : q))
        );
        const compressedBlob = await compressImage(file, 2400, 0.85);

        // Step 2: Upload directly to Cloudinary with signed credentials
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 30 } : q))
        );

        const uploadedUrl = await uploadDirectToCloudinary(
          compressedBlob,
          file.name,
          (percent) => {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === item.id ? { ...q, progress: Math.min(30 + Math.round(percent * 0.7), 99) } : q
              )
            );
          }
        );

        // Step 3: Success
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'done', progress: 100, url: uploadedUrl } : q
          )
        );

        // Append to artwork images
        setImages((prev) => [...prev, uploadedUrl]);
      } catch (err) {
        const errorText = err instanceof Error ? err.message : 'Upload failed.';
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: errorText } : q))
        );
        setErrorMessage(`Error uploading "${file.name}": ${errorText}`);
      }
    }

    // Reset input elements so the same file can be picked again if desired
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Reordering: Move Left / Move Right (touch-friendly)
  const moveImage = (index: number, direction: 'left' | 'right') => {
    setIsDirty(true);
    setImages((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  // Set as Cover (Move to index 0)
  const setAsCover = (index: number) => {
    if (index === 0) return;
    setIsDirty(true);
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setIsDirty(true);
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Drag-and-drop support
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setIsDirty(true);
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(draggedIndex, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
    setDraggedIndex(null);
  };

  // 7. Form Submission & Client-side Zod Validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    const rawPayload = {
      title: title.trim(),
      slug: cleanSlug,
      type,
      medium: medium.trim(),
      size: size.trim(),
      price: price === '' ? 0 : Number(price),
      currency: currency || 'USD',
      description: description.trim() || `${title.trim()} by Lisa Dietel.`,
      images,
      sold,
      featured,
      useWallMockup,
      showInHero,
      heroOrder: heroOrder === '' ? undefined : Number(heroOrder),
      heroHeadline: heroHeadline.trim() || undefined,
      heroSubtitle: heroSubtitle.trim() || undefined,
      heroLabel: heroLabel.trim() || undefined,
    };

    // Client-side Zod validation
    const validation = artworkInputSchema.safeParse(rawPayload);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      setErrorMessage(firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Validation error.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      let res: Response;
      if (isNew) {
        res = await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validation.data),
        });
      } else {
        const updateSlug = existingArtwork?.slug || cleanSlug;
        res = await fetch('/api/artworks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...validation.data,
            slug: updateSlug,
            newSlug: cleanSlug,
          }),
        });
      }

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        setErrorMessage(resData.error || 'Failed to save artwork.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Success: clear draft & navigate back to catalog
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
      setIsDirty(false);
      setSuccessMessage(isNew ? 'Artwork created successfully!' : 'Artwork updated successfully!');

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage('Network error while saving artwork.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmLeave = confirm('You have unsaved changes in this form. Discard changes and return to catalog?');
      if (!confirmLeave) return;
    }
    router.push('/admin');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-ink">Loading artwork details...</p>
        <p className="text-xs text-muted mt-1">Preparing studio canvas editor</p>
      </div>
    );
  }

  const activeUploads = uploadQueue.filter((q) => q.status === 'compressing' || q.status === 'uploading');

  return (
    <div className="min-h-screen bg-paper pb-36">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md border-b border-line px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-muted hover:text-ink hover:bg-mist/30 transition-colors"
            title="Back to admin dashboard"
            aria-label="Back to admin dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-sage font-medium">
              {isNew ? 'New Studio Creation' : 'Studio Piece Editor'}
            </span>
            <h1 className="font-heading text-xl sm:text-2xl text-ink font-normal leading-tight truncate max-w-[240px] sm:max-w-md">
              {isNew ? 'Add Artwork' : title || 'Edit Artwork'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && slug && (
            <Link
              href={`/artwork/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-ink px-3 py-2 rounded-xl border border-line bg-white/70 hover:bg-white transition-all flex items-center gap-1.5 min-h-[40px]"
              title="Preview piece on public site"
            >
              <Eye className="h-4 w-4 text-sage" />
              <span className="hidden sm:inline">Preview on site</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Autosave Draft Notification Banner */}
        {draftBannerVisible && (
          <div className="p-4 rounded-2xl bg-blush/30 border border-blush text-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-5 w-5 text-ink shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-ink">
                  Autosaved draft from previous session found
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Would you like to resume editing where you left off?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-3.5 py-1.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink/90 transition-all min-h-[36px]"
              >
                Restore draft
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 rounded-xl border border-line text-xs text-muted hover:text-ink transition-all min-h-[36px]"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Please review the form</p>
              <p className="mt-0.5 text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-mist/50 border border-sage/40 text-sage text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <Check className="h-5 w-5 text-sage shrink-0" />
            <span className="font-medium text-ink">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Core Details */}
          <div className="bg-white rounded-2xl border border-line p-5 sm:p-7 shadow-sm space-y-5">
            <h2 className="font-heading text-lg sm:text-xl text-ink font-normal border-b border-line pb-3">
              Essential Artwork Information
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="art-title" className="block text-xs font-medium text-muted mb-1.5">
                Artwork title *
              </label>
              <input
                id="art-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Nocturne in Ochre"
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink text-base focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="art-slug" className="block text-xs font-medium text-muted mb-1.5">
                URL slug * (lowercase with hyphens)
              </label>
              <div className="flex rounded-xl border border-line bg-paper/40 overflow-hidden focus-within:ring-2 focus-within:ring-sage/40 focus-within:border-sage">
                <span className="px-3.5 py-3 text-xs text-muted/80 font-mono shrink-0 select-none hidden sm:inline border-r border-line/60">
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
                    setIsDirty(true);
                  }}
                  placeholder="nocturne-in-ochre"
                  className="w-full px-3.5 py-3 text-sm bg-transparent text-ink font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Artwork classification
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-paper rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => {
                    setType('original');
                    setIsDirty(true);
                  }}
                  className={`py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    type === 'original'
                      ? 'bg-ink text-paper shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Original painting
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('print');
                    setIsDirty(true);
                  }}
                  className={`py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    type === 'print'
                      ? 'bg-ink text-paper shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Limited edition print
                </button>
              </div>
            </div>

            {/* Medium, Size & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label htmlFor="art-medium" className="block text-xs font-medium text-muted mb-1.5">
                  Medium *
                </label>
                <input
                  id="art-medium"
                  type="text"
                  required
                  value={medium}
                  onChange={(e) => {
                    setMedium(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Oil on Belgian linen"
                  className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                />
              </div>

              <div>
                <label htmlFor="art-size" className="block text-xs font-medium text-muted mb-1.5">
                  Dimensions / Size *
                </label>
                <input
                  id="art-size"
                  type="text"
                  required
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="60 × 80 cm (24 × 32 in)"
                  className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                />
              </div>

              <div>
                <label htmlFor="art-price" className="block text-xs font-medium text-muted mb-1.5">
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
                    onChange={(e) => {
                      setPrice(e.target.value === '' ? '' : Number(e.target.value));
                      setIsDirty(true);
                    }}
                    placeholder="1400"
                    className="w-full pl-8 pr-3.5 py-3 rounded-xl border border-line bg-paper/30 text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="art-desc" className="block text-xs font-medium text-muted mb-1.5">
                Story &amp; description
              </label>
              <textarea
                id="art-desc"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Geological pigments, atmospheric light, framing specifics, provenance..."
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper/30 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 2: Image Uploads & Reordering */}
          <div className="bg-white rounded-2xl border border-line p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-line pb-3">
              <div>
                <h2 className="font-heading text-lg sm:text-xl text-ink font-normal">
                  Artwork Images ({images.length})
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  The first image serves as the collection cover. Drag or use arrows to reorder.
                </p>
              </div>

              {images.length > 0 && (
                <span className="text-[11px] text-sage font-medium self-start sm:self-auto">
                  Cover is set
                </span>
              )}
            </div>

            {/* Upload Buttons: Camera & File Library */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Camera direct snapshot on mobile */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
                id="artwork-camera-upload"
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={activeUploads.length > 0}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border border-sage/40 bg-sage/10 hover:bg-sage/15 text-sage font-medium text-xs sm:text-sm transition-all active:scale-[0.99] disabled:opacity-50 min-h-[48px]"
              >
                <Camera className="h-4 w-4" />
                <span>Take photo with camera</span>
              </button>

              {/* Multi-image photo library picker */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
                id="artwork-multi-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={activeUploads.length > 0}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border border-line bg-paper hover:bg-mist/30 text-ink font-medium text-xs sm:text-sm transition-all active:scale-[0.99] disabled:opacity-50 min-h-[48px]"
              >
                <Upload className="h-4 w-4 text-muted" />
                <span>Upload from photos / library</span>
              </button>
            </div>

            {/* Active upload queue progress indicators */}
            {uploadQueue.length > 0 && (
              <div className="space-y-2 pt-1">
                {uploadQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-line bg-paper/60 text-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="truncate font-medium text-ink">{item.name}</span>
                        <span className="text-[11px] text-muted font-mono shrink-0 ml-2">
                          {item.status === 'compressing'
                            ? 'Compressing (max 2400px)...'
                            : item.status === 'uploading'
                            ? `Uploading ${item.progress}%`
                            : item.status === 'done'
                            ? 'Ready'
                            : 'Upload error'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-line overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            item.status === 'error'
                              ? 'bg-red-500'
                              : item.status === 'done'
                              ? 'bg-sage'
                              : 'bg-ink'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Image Preview & Reorder Grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                {images.map((imgUrl, index) => {
                  const isCover = index === 0;
                  return (
                    <div
                      key={`${imgUrl}-${index}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className={`relative rounded-2xl overflow-hidden border bg-paper group transition-all select-none ${
                        isCover ? 'border-sage/80 shadow-sm ring-2 ring-sage/30' : 'border-line'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[3/4] bg-mist/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Artwork view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/nocturne-in-ochre.svg';
                          }}
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ink text-paper text-[10px] font-medium tracking-wide shadow flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>Cover</span>
                          </div>
                        )}

                        {/* Top-Right Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-ink/75 hover:bg-red-600 text-white transition-colors"
                          title="Remove image"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Touch-Friendly Action Bar Below Thumbnail */}
                      <div className="p-2 border-t border-line/60 bg-white flex items-center justify-between gap-1">
                        {!isCover ? (
                          <button
                            type="button"
                            onClick={() => setAsCover(index)}
                            className="text-[11px] font-medium text-sage hover:text-ink px-2 py-1 rounded-lg hover:bg-mist/30 transition-colors"
                          >
                            Set cover
                          </button>
                        ) : (
                          <span className="text-[11px] text-muted italic px-2 py-1">Cover photo</span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'left')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg border border-line hover:bg-paper disabled:opacity-30 disabled:pointer-events-none text-muted hover:text-ink"
                            title="Move earlier"
                            aria-label={`Move image ${index + 1} earlier`}
                          >
                            <MoveLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'right')}
                            disabled={index === images.length - 1}
                            className="p-1.5 rounded-lg border border-line hover:bg-paper disabled:opacity-30 disabled:pointer-events-none text-muted hover:text-ink"
                            title="Move later"
                            aria-label={`Move image ${index + 1} later`}
                          >
                            <MoveRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-line rounded-2xl bg-paper/30">
                <Upload className="h-8 w-8 text-muted/60 mx-auto mb-2" />
                <p className="text-xs font-medium text-ink">No photos added yet</p>
                <p className="text-[11px] text-muted mt-0.5">
                  Take a photo with your phone camera or select files from your library.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 3: Catalog Status Toggles */}
          <div className="bg-white rounded-2xl border border-line p-5 sm:p-7 shadow-sm space-y-4">
            <h2 className="font-heading text-lg sm:text-xl text-ink font-normal border-b border-line pb-3">
              Gallery Availability &amp; Showcase
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-line hover:bg-paper/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={sold}
                  onChange={(e) => {
                    setSold(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
                />
                <div>
                  <span className="block text-xs font-medium text-ink">Mark as sold out</span>
                  <span className="block text-[11px] text-muted">
                    Shows sold ribbon and disables inquiry requests
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-line hover:bg-paper/40 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
                />
                <div>
                  <span className="block text-xs font-medium text-ink">Feature on homepage</span>
                  <span className="block text-[11px] text-muted">
                    Highlights piece in the selected works showcase
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-line hover:bg-paper/40 cursor-pointer transition-colors sm:col-span-2">
                <input
                  type="checkbox"
                  checked={!useWallMockup}
                  onChange={(e) => {
                    setUseWallMockup(!e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
                />
                <div>
                  <span className="block text-xs font-medium text-ink">Photo already staged</span>
                  <span className="block text-[11px] text-muted">
                    Check if the uploaded photo is already captured in a gallery interior or room (renders full-bleed without studio mockup)
                  </span>
                </div>
              </label>

              {/* Show in Hero Slider Toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-line hover:bg-paper/40 cursor-pointer transition-colors sm:col-span-2">
                <input
                  type="checkbox"
                  checked={showInHero}
                  onChange={(e) => {
                    setShowInHero(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-5 h-5 rounded text-ink focus:ring-sage border-line accent-ink"
                />
                <div>
                  <span className="block text-xs font-medium text-ink">Show in hero slider</span>
                  <span className="block text-[11px] text-muted">
                    Feature this artwork in the rotating full-screen hero carousel on the homepage
                  </span>
                </div>
              </label>
            </div>

            {/* Expanded Hero Slider Details */}
            {showInHero && (
              <div className="mt-4 p-4 sm:p-5 rounded-2xl border border-sage/40 bg-mist/20 space-y-4">
                <div className="flex items-center justify-between border-b border-sage/20 pb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage">
                    Homepage Hero Presentation
                  </span>
                  <span className="text-[11px] text-muted">
                    Leave headline &amp; subtitle empty to use artwork title &amp; description
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="art-hero-order" className="block text-xs font-medium text-muted mb-1.5">
                      Hero order (optional)
                    </label>
                    <input
                      id="art-hero-order"
                      type="number"
                      min="0"
                      step="1"
                      value={heroOrder}
                      onChange={(e) => {
                        setHeroOrder(e.target.value === '' ? '' : Number(e.target.value));
                        setIsDirty(true);
                      }}
                      placeholder="e.g. 1 (lower numbers appear first)"
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                    />
                  </div>

                  <div>
                    <label htmlFor="art-hero-label" className="block text-xs font-medium text-muted mb-1.5">
                      Hero eyebrow label (optional)
                    </label>
                    <input
                      id="art-hero-label"
                      type="text"
                      value={heroLabel}
                      onChange={(e) => {
                        setHeroLabel(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Studio Works · Archival Editions"
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="art-hero-headline" className="block text-xs font-medium text-muted mb-1.5">
                    Hero headline (optional)
                  </label>
                  <input
                    id="art-hero-headline"
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => {
                      setHeroHeadline(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder={`Defaults to "${title || 'Artwork Title'}"`}
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
                  />
                </div>

                <div>
                  <label htmlFor="art-hero-subtitle" className="block text-xs font-medium text-muted mb-1.5">
                    Hero subtitle (optional)
                  </label>
                  <textarea
                    id="art-hero-subtitle"
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => {
                      setHeroSubtitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Defaults to artwork story and description..."
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage resize-y leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </main>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-line px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Status & Cancel */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="text-xs text-muted hover:text-ink font-medium px-3 py-2 rounded-xl hover:bg-mist/30 transition-colors shrink-0 min-h-[44px]"
            >
              Cancel
            </button>

            <span className="text-[11px] text-muted truncate hidden sm:inline">
              {lastSavedDraftAt
                ? `Draft saved at ${lastSavedDraftAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : isDirty
                ? 'Unsaved changes'
                : 'All changes saved'}
            </span>
          </div>

          {/* Save Action */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || activeUploads.length > 0}
            className="px-6 py-3 rounded-xl bg-ink text-paper font-medium text-xs sm:text-sm tracking-wide hover:bg-ink/90 active:scale-[0.99] transition-all disabled:opacity-50 min-h-[46px] flex items-center gap-2 shadow-sm shrink-0"
          >
            {submitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-paper" />
                <span>Saving artwork...</span>
              </>
            ) : activeUploads.length > 0 ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-paper" />
                <span>Uploading photos...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-paper" />
                <span>{isNew ? 'Create artwork' : 'Save changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
