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
  category: ArtworkCategory;
  medium: string;
  dimensions: string; // e.g. "36 × 48 in (91 × 122 cm)"
  surface: string; // e.g. "Belgian linen over cedar stretcher bars"
  price: number;
  status: ArtworkStatus;
  isOriginalAvailable: boolean;
  hasPrints: boolean;
  printOptions?: IPrintOption[];
  imageUrl: string;
  detailImages?: string[];
  description: string;
  story?: string;
  featured?: boolean;
  exhibitions?: string[];
  createdAt?: string;
}
