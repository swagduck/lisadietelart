import 'dotenv/config';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork';
import { artworkInputSchema, ArtworkInput } from '../lib/validations';

const sampleArtworks: ArtworkInput[] = [
  {
    title: 'Nocturne in Ochre',
    slug: 'nocturne-in-ochre',
    type: 'original',
    medium: 'Oil, raw umber, and marble dust on Belgian linen',
    size: '48 × 60 in (122 × 152 cm)',
    price: 4200,
    currency: 'USD',
    description:
      'An immersive contemplation on fading crepuscular light over highland topography. Built up in twelve translucent glazes of French walnut oil and mineral earth pigments.',
    images: ['/images/nocturne-in-ochre.svg', '/images/detail-nocturne.svg'],
    sold: false,
    featured: true,
    useWallMockup: true,
    showInHero: true,
    heroOrder: 1,
    heroHeadline: 'Silent Horizons & Lingering Light',
    heroSubtitle:
      'Original oil and mineral paintings exploring atmospheric weight, memory, and organic stillness on raw Belgian linen.',
    heroLabel: 'Selected Collection',
  },
  {
    title: 'The Breath of Dawn',
    slug: 'the-breath-of-dawn',
    type: 'original',
    medium: 'Cold wax and oil with natural chalk on linen',
    size: '30 × 40 in (76 × 102 cm)',
    price: 2800,
    currency: 'USD',
    description:
      'Ethereal morning illumination dispersing maritime fog over still water. Delicate balance of textured impasto and scraped veil coats.',
    images: ['/images/the-breath-of-dawn.svg'],
    sold: false,
    featured: true,
    useWallMockup: true,
    showInHero: true,
    heroOrder: 2,
    heroHeadline: 'The Poetry of Ethereal Dawn',
    heroSubtitle:
      'Hand-ground mineral pigments blended with cold-pressed walnut oil, creating textured surfaces that gently breathe with daylight.',
    heroLabel: 'Studio Works · Archival Editions',
  },
  {
    title: 'Coastal Solitude',
    slug: 'coastal-solitude',
    type: 'original',
    medium: 'Mineral oil, pulverized basalt, and egg distemper on linen',
    size: '36 × 48 in (91 × 122 cm)',
    price: 3400,
    currency: 'USD',
    description:
      'Textured impasto study of weathered headland bluffs facing open swells. Cold mineral greens and quiet alabaster crests.',
    images: ['/images/coastal-solitude.svg'],
    sold: false,
    featured: true,
    useWallMockup: true,
    showInHero: false,
  },
  {
    title: 'Resonance in Sage',
    slug: 'resonance-in-sage',
    type: 'original',
    medium: 'Distemper, beeswax, and crushed lapis lazuli on linen',
    size: '36 × 48 in (91 × 122 cm)',
    price: 3600,
    currency: 'USD',
    description:
      'A warm atmospheric tapestry echoing weathered cliff lichen and aged verdigris. Originally commissioned for a private collection in Zurich.',
    images: ['/images/resonance-in-sage.svg'],
    sold: true,
    featured: true,
    useWallMockup: true,
    showInHero: false,
  },
  {
    title: 'Passage of Light IV (Print)',
    slug: 'passage-of-light-print',
    type: 'print',
    medium: 'Archival pigment print on 310gsm Hahnemühle German Etching paper',
    size: '16 × 20 in (41 × 51 cm)',
    price: 95,
    currency: 'USD',
    description:
      'Expressive walnut ink and raw sienna study reproduced with exacting color veracity. Limited edition of 100 copies.',
    images: ['/images/passage-of-light.svg'],
    sold: false,
    featured: true,
    useWallMockup: true,
    showInHero: false,
  },
  {
    title: 'Morning Mist (Collector Edition)',
    slug: 'morning-mist-archival-print',
    type: 'print',
    medium: 'Archival pigment print on 310gsm etching stock with deckle edge',
    size: '24 × 30 in (61 × 76 cm)',
    price: 150,
    currency: 'USD',
    description:
      'Collector edition of 30 impressions. All archival prints from this studio printing are officially sold out.',
    images: ['/images/morning-mist-print.svg'],
    sold: true,
    featured: true,
    useWallMockup: true,
    showInHero: false,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is missing.');
    console.log('Please define MONGODB_URI in your .env or .env.local file:');
    console.log('MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/art_portfolio?retryWrites=true&w=majority');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas (M0 free tier)...');
  await mongoose.connect(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  console.log('Validating 6 sample artworks with Zod schema...');
  for (const artwork of sampleArtworks) {
    artworkInputSchema.parse(artwork);
  }

  console.log('Upserting 6 sample artworks...');
  for (const item of sampleArtworks) {
    await Artwork.findOneAndUpdate(
      { slug: item.slug },
      { $set: item },
      { upsert: true, new: true }
    );
    console.log(` ✓ Seeded: "${item.title}" [${item.type}] (Sold: ${item.sold})`);
  }

  console.log('\n🎉 Successfully seeded 6 artworks to MongoDB Atlas.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed: An error occurred during database seeding.');
  if (process.env.DEBUG) {
    console.error(err);
  }
  process.exit(1);
});
