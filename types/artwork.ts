export type ArtworkType = 'original' | 'print';

export type ArtworkCategory =
  'All' | 'Oil on Linen' | 'Watercolors' | 'Studies & Sketches' | 'Selected Archive';

export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface IPrintOption {
  size: string;
  price: number;
  editionLimit?: number;
  available: boolean;
}

export interface IArtwork {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  year: number;
  type: ArtworkType;
  category: ArtworkCategory;
  medium: string;
  dimensions: string; // e.g. "36 × 48 in (91 × 122 cm)"
  surface?: string;
  price: number;
  status: ArtworkStatus;
  isSoldOut: boolean;
  isOriginalAvailable?: boolean;
  hasPrints?: boolean;
  printOptions?: IPrintOption[];
  imageUrl: string;
  detailImages?: string[];
  description: string;
  story?: string;
  featured?: boolean;
  exhibitions?: string[];
  createdAt?: string;
}

export interface ITestimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  acquiredArtwork?: string;
}

export interface IValueProp {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface IHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  artworkTitle: string;
  artworkDetails: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}
