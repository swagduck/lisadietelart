export type ArtworkType = 'original' | 'print';

export type ArtworkCategory =
  | 'All'
  | 'Oil on Linen'
  | 'Watercolors'
  | 'Studies & Sketches'
  | 'Selected Archive';

export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface IPrintOption {
  size: string;
  price: number;
  editionLimit?: number;
  available: boolean;
}

export interface IArtwork {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  type: ArtworkType;
  medium: string;
  size?: string;
  price: number;
  currency?: string;
  description: string;
  images?: string[];
  sold?: boolean;
  featured?: boolean;
  useWallMockup?: boolean;
  createdAt?: string | Date;

  // Compatibility helpers and UI properties
  year?: number;
  category?: ArtworkCategory | string;
  dimensions?: string;
  surface?: string;
  status?: ArtworkStatus;
  isSoldOut?: boolean;
  isOriginalAvailable?: boolean;
  hasPrints?: boolean;
  printOptions?: IPrintOption[];
  imageUrl?: string;
  detailImages?: string[];
  story?: string;
  exhibitions?: string[];
}

export interface IInquiry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  message: string;
  artworkSlug?: string | null;
  read?: boolean;
  createdAt?: string | Date;
}

export interface ISubscriber {
  _id?: string;
  email: string;
  createdAt?: string | Date;
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
