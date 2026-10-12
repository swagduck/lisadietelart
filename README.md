# Aura Vance — Fine Art Portfolio & Studio Shop

A bespoke art portfolio and e-commerce shop web application built for an independent painter using **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**.

Rebuilt directly from the `/index.html` visual reference into modular, type-safe React components while preserving the tactile, editorial gallery aesthetic.

---

## 🎨 Design Tokens

Configured in [`tailwind.config.ts`](tailwind.config.ts):

### Color Palette

- **`paper`**: `#f7f6f4` — Soft, museum-grade warm cotton rag paper background
- **`ink`**: `#2b2a2e` — Deep charcoal pigment for fine typography
- **`muted`**: `#6f6c72` — Soft graphite gray for metadata, captions, and secondary notes
- **`sage`**: `#5f7b6b` — Weathered botanical accent color for interactive states and badges
- **`blush`**: `#ecd3d8` — Gentle warm tone for print badges and text highlights
- **`mist`**: `#dfe8e2` — Subtle tinted wash for container panels and section backdrops
- **`line`**: `#e3dfda` — Delicate border tone defining frames and dividers

### Typography

- **Headings**: `Cormorant Garamond` (loaded via `next/font/google` variable `--font-cormorant`)
- **Body & Metadata**: `Jost` (loaded via `next/font/google` variable `--font-jost`)

---

## 📁 Folder Structure

```text
d:/ArtWeb/
├── app/                        # Next.js 14 App Router routes & layouts
│   ├── about/                  # Artist biography, statement & studio practice
│   ├── api/                    # Serverless API routes (Vercel-compatible)
│   │   ├── artworks/           # Artwork listing & admin creation
│   │   └── inquiries/          # Collector acquisition & commission inquiries
│   ├── contact/                # Direct studio contact & appointment scheduling
│   ├── shop/                   # Available original paintings & archival prints
│   ├── works/                  # Comprehensive works archive with filters
│   ├── globals.css             # Tailwind base layers, typography & custom scrollbar
│   ├── layout.tsx              # Root layout injecting fonts & CartProvider
│   └── page.tsx                # Homepage matching the /index.html reference layout
├── components/                 # Reusable React components
│   ├── about/                  # AboutSection (studio photo, philosophy, materials)
│   ├── contact/                # ContactSection (interactive acquisition form)
│   ├── exhibitions/            # ExhibitionList (solo/group exhibitions CV)
│   ├── gallery/                # ArtworkGrid, ArtworkCard, ArtworkModal
│   ├── hero/                   # Hero (editorial headline, framed painting showcase)
│   ├── layout/                 # Navbar (sticky, announcement, mobile menu) & Footer
│   └── shop/                   # CartContext & slide-over CartDrawer
├── lib/                        # Utility functions & data helpers
│   ├── data.ts                 # Realistic high-fidelity seed artworks & exhibitions
│   ├── mongodb.ts              # Serverless-cached Mongoose connection pool
│   └── utils.ts                # cn (clsx + tailwind-merge), formatPrice, slugify
├── models/                     # Mongoose schemas & data models
│   ├── Artwork.ts              # Original & limited print edition schema
│   ├── Inquiry.ts              # Collector acquisition inquiry schema
│   └── Order.ts                # Customer orders & checkout tracking schema
├── types/                      # TypeScript declarations & interfaces
│   ├── artwork.ts              # IArtwork, IPrintOption, ArtworkCategory, ArtworkStatus
│   ├── cart.ts                 # ICartItem, ICartContext
│   ├── inquiry.ts              # IInquiry, IExhibition
│   └── index.ts                # Barrel export
├── .env.example                # Environment variables template
├── .eslintrc.json              # ESLint configuration with Next.js core web vitals
├── .prettierrc                 # Prettier configuration with Tailwind plugin
├── index.html                  # Visual prototype reference for layout, spacing & feel
├── next.config.mjs             # Next.js configuration (Unsplash image optimization)
├── package.json                # Project dependencies & npm scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind tokens & typography configuration
└── tsconfig.json               # TypeScript strict configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required environment variables:

```env
# MongoDB Atlas M0 cluster connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/art_portfolio?retryWrites=true&w=majority

# Administrative access token
ADMIN_PASSWORD=your_secure_admin_password_here

# Session secret (min 32 characters)
SESSION_SECRET=your_super_secret_session_key_min_32_characters_long
```

_(Note: If `MONGODB_URI` is not provided, the app gracefully falls back to the static curated mock catalog in `lib/data.ts`, ensuring zero crashes during local development or Vercel preview deploys)._

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Linting and Formatting

```bash
npm run lint      # Runs ESLint (Next.js core web vitals)
npm run format    # Formats files using Prettier and sorts Tailwind classes
```

### 5. Production Build

```bash
npm run build
npm start
```

---

## ☁️ Vercel Free Tier Compatibility

This project is tailored to run on **Vercel's Hobby (Free) Tier**:

1. **Serverless Connection Caching**: `lib/mongodb.ts` caches the Mongoose connection instance across invocations to avoid exhausting MongoDB Atlas Free Tier (M0) connection pool limits.
2. **Standard App Router Handlers**: All routes in `app/api/` execute as standard serverless functions without heavy persistent background workers.
3. **Optimized Next/Image**: Remote domains (Unsplash) are explicitly whitelisted in `next.config.mjs` with WebP and AVIF formats enabled.
4. **Zero-Config Deployment**: Seamlessly links to GitHub and deploys automatically on Vercel with zero additional configuration.
