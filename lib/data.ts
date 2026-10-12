import { IArtwork } from '@/types/artwork';
import { IExhibition } from '@/types/inquiry';

export const ARTWORKS_DATA: IArtwork[] = [
  {
    id: 'nocturne-in-ochre',
    title: 'Nocturne in Ochre',
    slug: 'nocturne-in-ochre',
    year: 2024,
    category: 'Oil on Linen',
    medium: 'Oil, raw umber, and marble dust on Belgian linen',
    dimensions: '48 × 60 in (122 × 152 cm)',
    surface: 'Custom profile kiln-dried cedar stretcher bars',
    price: 4200,
    status: 'available',
    isOriginalAvailable: true,
    hasPrints: true,
    printOptions: [
      { size: '16 × 20 in', price: 140, editionLimit: 50, available: true },
      { size: '24 × 30 in', price: 260, editionLimit: 30, available: true },
      { size: '32 × 40 in', price: 420, editionLimit: 15, available: true },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=85',
    detailImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'An immersive contemplation on fading crepuscular light over highland topography. Built up in twelve translucent glazes of French walnut oil and mineral pigments.',
    story:
      'Painted during early autumn in the Hudson Valley studio, following prolonged walks through misty pine forests where twilight softens hard edges into tonal resonance.',
    featured: true,
    exhibitions: ['The Quiet Horizon (2025)', 'Earth & Resonance (2024)'],
  },
  {
    id: 'the-breath-of-dawn',
    title: 'The Breath of Dawn',
    slug: 'the-breath-of-dawn',
    year: 2024,
    category: 'Oil on Linen',
    medium: 'Cold wax and oil with natural chalk on linen',
    dimensions: '30 × 40 in (76 × 102 cm)',
    surface: 'Raw unprimed Belgian linen with rabbit skin glue sizing',
    price: 2800,
    status: 'available',
    isOriginalAvailable: true,
    hasPrints: true,
    printOptions: [
      { size: '16 × 20 in', price: 140, editionLimit: 50, available: true },
      { size: '24 × 32 in', price: 280, editionLimit: 25, available: true },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85',
    description:
      'Ethereal morning illumination dispersing maritime fog over still water. Delicate balance of textured impasto and scraped veil coats.',
    story:
      'Begun before sunrise when the bay was completely silver. A study in patience and the gentle transition of nocturnal blues into morning alabaster.',
    featured: true,
    exhibitions: ['Tribeca Fine Arts Spring Selection (2024)'],
  },
  {
    id: 'resonance-in-sage',
    title: 'Resonance in Sage',
    slug: 'resonance-in-sage',
    year: 2024,
    category: 'Oil on Linen',
    medium: 'Distemper, beeswax, and crushed lapis lazuli on linen',
    dimensions: '36 × 48 in (91 × 122 cm)',
    surface: 'Heavyweight portrait-grade European linen',
    price: 3600,
    status: 'sold',
    isOriginalAvailable: false,
    hasPrints: true,
    printOptions: [
      { size: '18 × 24 in', price: 180, editionLimit: 75, available: true },
      { size: '24 × 32 in', price: 290, editionLimit: 40, available: true },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85',
    description:
      'A warm atmospheric tapestry echoing weathered cliff lichen and aged verdigris. Commissioned for a private collection in Zurich.',
    story:
      'Original piece resides in a private residence in Switzerland. High-fidelity archival cotton rag prints are released in a signed limited edition.',
    featured: true,
  },
  {
    id: 'passage-of-light-iv',
    title: 'Passage of Light IV',
    slug: 'passage-of-light-iv',
    year: 2023,
    category: 'Studies & Sketches',
    medium: 'Walnut ink, raw sienna, and gouache on handmade cotton paper',
    dimensions: '22 × 30 in (56 × 76 cm)',
    surface: '300 gsm deckle-edge Arches cotton paper',
    price: 1450,
    status: 'available',
    isOriginalAvailable: true,
    hasPrints: true,
    printOptions: [
      { size: '12 × 16 in', price: 95, editionLimit: 100, available: true },
      { size: '18 × 24 in', price: 160, editionLimit: 50, available: true },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85',
    description:
      'A loose, expressive field study capturing fleeting afternoon beam reflections against limestone canyon walls.',
    story:
      'Part of the seasonal field journal created en plein air along the Catskill escarpment.',
    featured: false,
  },
  {
    id: 'silence-over-still-water',
    title: 'Silence Over Still Water',
    slug: 'silence-over-still-water',
    year: 2023,
    category: 'Watercolors',
    medium: 'Mineral watercolor, oxgall, and gum arabic on cold-press paper',
    dimensions: '20 × 28 in (51 × 71 cm)',
    surface: 'Saunders Waterford 425 gsm mould-made paper',
    price: 1750,
    status: 'available',
    isOriginalAvailable: true,
    hasPrints: true,
    printOptions: [{ size: '16 × 20 in', price: 135, editionLimit: 60, available: true }],
    imageUrl:
      'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1400&q=85',
    description:
      'Layered washes of deep indigo and slate gray forming an introspective lake horizon at dusk.',
    story:
      'Explores the threshold between physical landscape and memory through slow wet-on-wet mineral dispersion.',
    featured: false,
  },
  {
    id: 'earthen-soliloquy',
    title: 'Earthen Soliloquy',
    slug: 'earthen-soliloquy',
    year: 2024,
    category: 'Oil on Linen',
    medium: 'Oil, burned vine charcoal, and cold-pressed linseed on canvas',
    dimensions: '40 × 52 in (102 × 132 cm)',
    surface: 'Double-primed portrait canvas',
    price: 3900,
    status: 'reserved',
    isOriginalAvailable: false,
    hasPrints: true,
    printOptions: [
      { size: '20 × 26 in', price: 210, editionLimit: 40, available: true },
      { size: '30 × 39 in', price: 380, editionLimit: 20, available: true },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=85',
    description:
      'Tonalist exploration of tactile soil strata and weathered basalt cliffs under an overcast November sky.',
    story:
      'Currently on reserve for institutional acquisition pending spring exhibition opening.',
    featured: true,
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
