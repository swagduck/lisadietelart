import { IArtwork, IHeroSlide, ITestimonial, IValueProp } from '@/types/artwork';
import { IExhibition } from '@/types/inquiry';
import { connectToDatabase } from '@/lib/mongodb';
import { Artwork } from '@/models/Artwork';

export const HERO_SLIDES: IHeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Silent Horizons & Lingering Light',
    subtitle:
      'Original oil and mineral paintings exploring atmospheric weight, memory, and organic stillness on raw Belgian linen.',
    badge: 'New Collection · Winter 2025',
    imageUrl: '/images/nocturne-in-ochre.svg',
    artworkTitle: 'Nocturne in Ochre (2024)',
    artworkDetails: 'Oil on raw Belgian linen · 48 × 60 in',
    primaryCta: {
      label: 'Explore Originals',
      href: '/originals',
    },
    secondaryCta: {
      label: 'Browse Art Prints',
      href: '/prints',
    },
  },
  {
    id: 'slide-2',
    title: 'The Poetry of Ethereal Dawn',
    subtitle:
      'Hand-ground mineral pigments blended with cold-pressed walnut oil, creating textured surfaces that gently breathe with daylight.',
    badge: 'Studio Works · Archival Editions',
    imageUrl: '/images/the-breath-of-dawn.svg',
    artworkTitle: 'The Breath of Dawn (2024)',
    artworkDetails: 'Cold wax & chalk on linen · 30 × 40 in',
    primaryCta: {
      label: 'Shop Available Works',
      href: '/originals',
    },
    secondaryCta: {
      label: 'Commission a Piece',
      href: '/commissions',
    },
  },
];

export const ARTWORKS_DATA: IArtwork[] = [
  // --- ORIGINALS ---
  {
    id: 'nocturne-in-ochre',
    title: 'Nocturne in Ochre',
    slug: 'nocturne-in-ochre',
    year: 2024,
    type: 'original',
    category: 'Oil on Linen',
    medium: 'Oil, raw umber, and marble dust on Belgian linen',
    dimensions: '48 × 60 in (122 × 152 cm)',
    surface: 'Custom profile kiln-dried cedar stretcher bars',
    price: 4200,
    status: 'available',
    isSoldOut: false,
    isOriginalAvailable: true,
    hasPrints: true,
    imageUrl: '/images/nocturne-in-ochre.svg',
    detailImages: ['/images/detail-nocturne.svg'],
    description:
      'An immersive contemplation on fading crepuscular light over highland topography. Built up in twelve translucent glazes of French walnut oil and mineral earth pigments.',
    story:
      'Painted during early autumn in the studio, following prolonged walks through misty pine forests where twilight softens hard edges into tonal resonance.',
    featured: true,
    exhibitions: ['The Quiet Horizon (2025)', 'Earth & Resonance (2024)'],
  },
  {
    id: 'the-breath-of-dawn',
    title: 'The Breath of Dawn',
    slug: 'the-breath-of-dawn',
    year: 2024,
    type: 'original',
    category: 'Oil on Linen',
    medium: 'Cold wax and oil with natural chalk on linen',
    dimensions: '30 × 40 in (76 × 102 cm)',
    surface: 'Raw unprimed Belgian linen with rabbit skin glue sizing',
    price: 2800,
    status: 'available',
    isSoldOut: false,
    isOriginalAvailable: true,
    hasPrints: true,
    imageUrl: '/images/the-breath-of-dawn.svg',
    description:
      'Ethereal morning illumination dispersing maritime fog over still water. Delicate balance of textured impasto and scraped veil coats.',
    story:
      'Begun before sunrise when the bay was completely silver. A study in patience and the gentle transition of nocturnal blues into morning alabaster.',
    featured: true,
    exhibitions: ['Tribeca Fine Arts Spring Selection (2024)'],
  },
  {
    id: 'coastal-solitude',
    title: 'Coastal Solitude',
    slug: 'coastal-solitude',
    year: 2024,
    type: 'original',
    category: 'Oil on Linen',
    medium: 'Mineral oil, pulverized basalt, and egg distemper on linen',
    dimensions: '36 × 48 in (91 × 122 cm)',
    surface: 'Solid European cedar stretchers with brass keys',
    price: 3400,
    status: 'available',
    isSoldOut: false,
    isOriginalAvailable: true,
    hasPrints: false,
    imageUrl: '/images/coastal-solitude.svg',
    description:
      'Textured impasto study of weathered headland bluffs facing open swells. Cold mineral greens and quiet alabaster crests.',
    story:
      'Created after solitary observation along the Atlantic bluffs during high tide, capturing salt spray diffused across afternoon atmosphere.',
    featured: true,
  },
  {
    id: 'passage-of-light-iv',
    title: 'Passage of Light IV',
    slug: 'passage-of-light-iv',
    year: 2023,
    type: 'original',
    category: 'Studies & Sketches',
    medium: 'Walnut ink, raw sienna, and gouache on handmade cotton paper',
    dimensions: '22 × 30 in (56 × 76 cm)',
    surface: '300 gsm deckle-edge Arches cotton paper',
    price: 1450,
    status: 'available',
    isSoldOut: false,
    isOriginalAvailable: true,
    hasPrints: true,
    imageUrl: '/images/passage-of-light.svg',
    description:
      'A loose, expressive field study capturing fleeting afternoon beam reflections against limestone canyon walls.',
    story:
      'Part of the seasonal field journal created en plein air along the mountain escarpment.',
    featured: true,
  },
  {
    id: 'resonance-in-sage',
    title: 'Resonance in Sage',
    slug: 'resonance-in-sage',
    year: 2024,
    type: 'original',
    category: 'Oil on Linen',
    medium: 'Distemper, beeswax, and crushed lapis lazuli on linen',
    dimensions: '36 × 48 in (91 × 122 cm)',
    surface: 'Heavyweight portrait-grade European linen',
    price: 3600,
    status: 'sold',
    isSoldOut: true,
    isOriginalAvailable: false,
    hasPrints: true,
    imageUrl: '/images/resonance-in-sage.svg',
    description:
      'A warm atmospheric tapestry echoing weathered cliff lichen and aged verdigris. Originally commissioned for a private collection in Zurich.',
    story:
      'Original piece resides in a private residence in Switzerland. Archival prints are available in a limited signed run.',
    featured: true,
  },
  {
    id: 'earthen-soliloquy',
    title: 'Earthen Soliloquy',
    slug: 'earthen-soliloquy',
    year: 2024,
    type: 'original',
    category: 'Oil on Linen',
    medium: 'Oil, burned vine charcoal, and cold-pressed linseed on canvas',
    dimensions: '40 × 52 in (102 × 132 cm)',
    surface: 'Double-primed portrait canvas',
    price: 3900,
    status: 'sold',
    isSoldOut: true,
    isOriginalAvailable: false,
    hasPrints: true,
    imageUrl: '/images/earthen-soliloquy.svg',
    description:
      'Tonalist exploration of tactile soil strata and weathered basalt cliffs under an overcast November sky.',
    story:
      'Currently in private collection. Exhibited during the 2024 Earth & Resonance salon.',
    featured: true,
  },

  // --- ART PRINTS ---
  {
    id: 'nocturne-in-ochre-print',
    title: 'Nocturne in Ochre (Limited Print)',
    slug: 'nocturne-in-ochre-print',
    year: 2024,
    type: 'print',
    category: 'Selected Archive',
    medium: 'Archival pigment print on 310gsm Hahnemühle German Etching paper',
    dimensions: '24 × 30 in (61 × 76 cm)',
    surface: '100% cotton rag, acid-free museum stock, hand-deckled edges',
    price: 160,
    status: 'available',
    isSoldOut: false,
    imageUrl: '/images/nocturne-in-ochre.svg',
    description:
      'Museum-grade limited edition print capturing the fine brushstroke relief, ochre undertones, and velvet depth of the original canvas. Edition of 50, numbered and embossed.',
    featured: true,
  },
  {
    id: 'the-breath-of-dawn-print',
    title: 'The Breath of Dawn (Limited Print)',
    slug: 'the-breath-of-dawn-print',
    year: 2024,
    type: 'print',
    category: 'Selected Archive',
    medium: 'Archival pigment print on 310gsm Hahnemühle cotton rag',
    dimensions: '18 × 24 in (46 × 61 cm)',
    surface: 'Deckle-edge fine art cotton paper with embossed studio seal',
    price: 140,
    status: 'available',
    isSoldOut: false,
    imageUrl: '/images/the-breath-of-dawn.svg',
    description:
      'Faithful chromatic reproduction of the misty morning bay study. Retains subtle chalk scumbles and water highlights.',
    featured: false,
  },
  {
    id: 'resonance-in-sage-print',
    title: 'Resonance in Sage (Limited Print)',
    slug: 'resonance-in-sage-print',
    year: 2024,
    type: 'print',
    category: 'Selected Archive',
    medium: 'Archival giclée pigment print on mould-made cotton paper',
    dimensions: '24 × 32 in (61 × 81 cm)',
    surface: '310gsm heavyweight archival rag paper',
    price: 180,
    status: 'available',
    isSoldOut: false,
    imageUrl: '/images/resonance-in-sage.svg',
    description:
      'Signed limited edition print run of 75. Captures the muted lapis lazuli and warm botanical sage pigment nuances.',
    featured: false,
  },
  {
    id: 'silence-over-still-water-print',
    title: 'Silence Over Still Water (Print)',
    slug: 'silence-over-still-water-print',
    year: 2023,
    type: 'print',
    category: 'Watercolors',
    medium: 'Archival pigment print on cold-press fine art paper',
    dimensions: '20 × 28 in (51 × 71 cm)',
    surface: '300gsm textured watercolor paper',
    price: 135,
    status: 'available',
    isSoldOut: false,
    imageUrl: '/images/silence-water.svg',
    description:
      'Deep indigo and slate water horizon study. High dynamic range reproduction that showcases the delicate wet-on-wet pigment blooms.',
    featured: false,
  },
  {
    id: 'passage-of-light-print',
    title: 'Passage of Light IV (Print)',
    slug: 'passage-of-light-print',
    year: 2023,
    type: 'print',
    category: 'Studies & Sketches',
    medium: 'Fine art pigment print on warm archival rag',
    dimensions: '16 × 20 in (41 × 51 cm)',
    surface: '310gsm warm white textured cotton',
    price: 95,
    status: 'available',
    isSoldOut: false,
    imageUrl: '/images/passage-of-light.svg',
    description:
      'Expressive walnut ink and raw sienna study reproduced with exacting color veracity. Limited to 100 copies.',
    featured: false,
  },
  {
    id: 'morning-mist-archival-print',
    title: 'Morning Mist (Collector Edition)',
    slug: 'morning-mist-archival-print',
    year: 2023,
    type: 'print',
    category: 'Selected Archive',
    medium: 'Archival pigment print on 310gsm etching stock',
    dimensions: '24 × 30 in (61 × 76 cm)',
    surface: 'Hand-torn deckle edge cotton paper',
    price: 150,
    status: 'sold',
    isSoldOut: true,
    imageUrl: '/images/morning-mist-print.svg',
    description:
      'Collector edition of 30 copies. All archival impressions from this studio printing are officially sold out.',
    featured: false,
  },
];

export const TESTIMONIALS_DATA: ITestimonial[] = [
  {
    id: 'test-1',
    quote:
      'The presence this painting commands in our home is extraordinary. Throughout the day, the natural mineral pigments subtly shift in the shifting sunlight, revealing new layers of depth.',
    author: 'Dr. Julian Mercer',
    location: 'Zurich, Switzerland',
    acquiredArtwork: 'Acquired "Nocturne in Ochre"',
  },
  {
    id: 'test-2',
    quote:
      'Working with Lisa on our bespoke living room canvas was a breathtaking experience. She listened to our emotional connection to the coast and created an heirloom that will stay in our family forever.',
    author: 'Clara & Henrik Vance',
    location: 'London, UK',
    acquiredArtwork: 'Private Commission',
  },
  {
    id: 'test-3',
    quote:
      'The archival print quality exceeded all expectations. The texture of the Hahnemühle cotton rag looks and feels virtually indistinguishable from an original gouache study.',
    author: 'Sophie Laurent',
    location: 'Paris, France',
    acquiredArtwork: 'Acquired "Silence Over Still Water"',
  },
];

export const VALUE_PROPS_DATA: IValueProp[] = [
  {
    id: 'prop-1',
    title: 'Museum-Grade Archival Materials',
    description:
      'Every canvas is constructed with hand-stretched Belgian flax linen, historical mineral pigments, and cold-pressed oils rated for 100+ years of lightfast longevity.',
    badge: '100+ Year Lightfast',
  },
  {
    id: 'prop-2',
    title: 'Insured White-Glove Transit',
    description:
      'Original paintings are custom-crated in reinforced timber packaging with worldwide insured courier delivery and dedicated tracking straight to your door.',
    badge: 'Worldwide Transit',
  },
  {
    id: 'prop-3',
    title: 'Bespoke Studio Commissions',
    description:
      'Collaborate directly with the painter to create custom, site-specific original works tailored to your space, color narrative, and architectural proportions.',
    badge: 'Direct Collaboration',
  },
];

export const EXHIBITIONS_DATA: IExhibition[] = [
  {
    year: 2025,
    title: 'The Quiet Horizon',
    venue: 'Galerie Montparnasse',
    location: 'Paris, France',
    type: 'Solo Exhibition',
    status: 'Upcoming / May 2025',
  },
  {
    year: 2024,
    title: 'Earth & Resonance',
    venue: 'Tribeca Fine Arts',
    location: 'New York, NY',
    type: 'Group Exhibition',
    status: 'Concluded',
  },
  {
    year: 2023,
    title: 'Studies in Mineral & Mist',
    venue: 'St. Jude Contemporary',
    location: 'London, UK',
    type: 'Solo Exhibition',
    status: 'Concluded',
  },
  {
    year: 2022,
    title: 'Light Across Time',
    venue: 'Nordic Art Space',
    location: 'Stockholm, Sweden',
    type: 'Group Exhibition',
    status: 'Concluded',
  },
];

// Normalization helper for converting Mongoose lean documents to plain serializable objects
function serializeArtwork(doc: any): IArtwork {
  return {
    _id: doc._id ? doc._id.toString() : undefined,
    id: doc._id ? doc._id.toString() : doc.slug,
    title: doc.title,
    slug: doc.slug,
    type: doc.type,
    medium: doc.medium,
    size: doc.size || doc.dimensions || '',
    dimensions: doc.size || doc.dimensions || '',
    price: doc.price,
    currency: doc.currency || 'USD',
    description: doc.description,
    images:
      Array.isArray(doc.images) && doc.images.length > 0
        ? doc.images
        : [doc.imageUrl || '/images/nocturne-in-ochre.svg'],
    imageUrl:
      (doc.images && doc.images[0]) || doc.imageUrl || '/images/nocturne-in-ochre.svg',
    sold: Boolean(doc.sold ?? doc.isSoldOut),
    isSoldOut: Boolean(doc.sold ?? doc.isSoldOut),
    featured: Boolean(doc.featured),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
  };
}

// Real MongoDB Atlas Queries with graceful fallback
export async function getOriginals(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'original' })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'original');
}

export async function getPrints(): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const docs = await Artwork.find({ type: 'print' })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (docs && docs.length > 0) {
        return docs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.filter((item) => item.type === 'print');
}

export async function getSelectedWorks(limit = 6): Promise<IArtwork[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const featuredDocs = await Artwork.find({ featured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (featuredDocs && featuredDocs.length > 0) {
        return featuredDocs.map(serializeArtwork);
      }
      const allDocs = await Artwork.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      if (allDocs && allDocs.length > 0) {
        return allDocs.map(serializeArtwork);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.slice(0, limit);
}

export async function getArtworkBySlug(slug: string): Promise<IArtwork | undefined> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const doc = await Artwork.findOne({ slug }).lean().exec();
      if (doc) {
        return serializeArtwork(doc);
      }
    }
  } catch {
    // Safe fallback without leaking connection details
  }
  return ARTWORKS_DATA.find((item) => item.slug === slug);
}
