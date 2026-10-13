# Lisa Dietel — Fine Art Portfolio & Studio Shop

A bespoke art portfolio and e-commerce web application built for independent contemporary painter **Lisa Dietel** using **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas (M0 Free Tier)** with **Mongoose**.

Targeted specifically for deployment on **Vercel's Free (Hobby) Tier** and **MongoDB Atlas M0 Free Tier** with zero operational cost.

---

## 🎨 Design Tokens

Configured in [`tailwind.config.ts`](tailwind.config.ts):

### Color Palette
- **`paper`**: `#f7f6f4` — Soft, museum-grade warm cotton rag paper background
- **`ink`**: `#2b2a2e` — Deep charcoal mineral pigment for high-contrast typography (AAA compliant)
- **`muted`**: `#6f6c72` — Soft graphite gray for metadata, captions, and secondary notes (AA compliant)
- **`sage`**: `#5f7b6b` — Weathered botanical accent color for interactive states, badges, and focus rings
- **`blush`**: `#ecd3d8` — Gentle warm rose tone for print badges and subtle highlights
- **`mist`**: `#dfe8e2` — Soft tinted wash for container panels and section backdrops
- **`line`**: `#e3dfda` — Delicate border tone defining frames and dividers

### Typography
- **Headings**: `Cormorant Garamond` (loaded via `next/font/google` variable `--font-cormorant`)
- **Body & Metadata**: `Jost` (loaded via `next/font/google` variable `--font-jost`)

---

## 🔐 Environment Variables

Create `.env.local` for local development by copying `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `MONGODB_URI` | **Yes** (in prod) | MongoDB Atlas connection string (M0 compatible) | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/art_portfolio?retryWrites=true&w=majority` |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name for media assets | `my-art-studio` |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret | `your_api_secret_here` |
| `ADMIN_PASSWORD` | **Yes** | Secure password/token for administrative actions and mutations | `your_secure_admin_password_here` |
| `SESSION_SECRET` | **Yes** | 32+ character random secret string used for session encryption | `super_secret_session_key_min_32_characters_long` |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical public URL used for SEO Open Graph, sitemap, and JSON-LD | `https://lisadietelart.com` (defaults to `http://localhost:3000` locally) |

> **Security Note**: No database connection strings, credentials, or private secrets use the `NEXT_PUBLIC_` prefix. All `.env*` files are strictly gitignored via [`.gitignore`](.gitignore).

---

## ☁️ Deployment Guide (Vercel + MongoDB Atlas)

### Step 1: Set Up MongoDB Atlas Free Tier (M0)
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster selecting the **M0 Sandbox (Free Tier)**.
3. Under **Database Access**, create a database user with read & write privileges.
4. Under **Network Access**, add an IP Access entry for `0.0.0.0/0` (Allow access from anywhere, required for serverless platforms like Vercel).
5. Under **Database** > **Connect** > **Drivers**, copy your connection string URI and replace `<password>` with your database user password.

### Step 2: Seed the Database
Run the automated seed script to populate the database with the 6 curated sample artworks:

```bash
# In your local terminal with MONGODB_URI set in .env.local:
npm run seed
```

Output:
```text
Connecting to MongoDB Atlas (M0 free tier)...
Validating 6 sample artworks with Zod schema...
Upserting 6 sample artworks...
 ✓ Seeded: "Nocturne in Ochre" [original] (Sold: false)
 ✓ Seeded: "The Breath of Dawn" [original] (Sold: false)
 ✓ Seeded: "Coastal Solitude" [original] (Sold: false)
 ✓ Seeded: "Resonance in Sage" [original] (Sold: true)
 ✓ Seeded: "Passage of Light IV (Print)" [print] (Sold: false)
 ✓ Seeded: "Morning Mist (Collector Edition)" [print] (Sold: true)
🎉 Successfully seeded 6 artworks to MongoDB Atlas.
```

### Step 3: Deploy to Vercel
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New...** > **Project** and import your GitHub repository (`swagduck/lisadietelart`).
3. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `ADMIN_PASSWORD`: Your admin password (for `/admin` access)
   - `SESSION_SECRET`: Your 32-character session secret (for signed `jose` JWT cookies)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g. `https://your-domain.vercel.app`)
4. **Function Region Optimization**: In **Settings > Functions > Function Region**, select the region nearest to your MongoDB Atlas cluster (e.g., `iad1` Washington, D.C. for AWS `us-east-1` Atlas M0) to minimize database query latency.
5. Click **Deploy**. Vercel will build and launch your production site automatically.

---

## 📱 Mobile-First Studio Admin Area (`/admin`)

A dedicated management portal designed specifically for single-handed use on a phone:

- **Authentication & Security**:
  - Protected by Next.js Edge Middleware guarding `/admin/*` and write API endpoints (`POST`, `PUT`, `DELETE` on `/api/artworks`, `/api/upload`, and `/api/admin/*`).
  - Single password verification (`ADMIN_PASSWORD`), issuing a signed `httpOnly` JWT session cookie using `jose`.
  - In-memory rate limiting against brute-force login attempts (5 attempts per 15 min per IP).
- **Artwork Management**:
  - Live listing of all artworks with thumbnail preview, title, medium, size, and price.
  - **One-tap instant toggles** for **Sold Out / Available** and **Featured ⭐** with instantaneous cache invalidation via `revalidatePath`.
  - Create and edit dialog with automatic slug generator, type picker (Original vs Limited Print), and price.
  - Safe delete with confirmation prompt.
- **Image Uploads (Cloudinary + Local Fallback)**:
  - Upload photos directly from phone camera or gallery via `/api/upload`.
  - Secure server-side signed Cloudinary upload storing returned secure URLs in MongoDB.
  - Automatic graceful fallback to local storage if Cloudinary account is pending activation.
- **Inquiries & Subscribers**:
  - **Inquiries Tab**: View collector acquisition messages, inquired artwork slug, with one-tap `mailto:` collector replies.
  - **Subscribers Tab**: View newsletter signups with instant one-tap **CSV Export** for email marketing tools.

---

## ⚡ Architecture & Production Optimizations

- **`server-only` Isolation**: `lib/mongodb.ts` and `lib/server-data.ts` enforce `import "server-only"`, preventing Mongoose or server libraries from ever being accidentally imported into client JavaScript bundles.
- **Serverless Connection Pooling**: `lib/mongodb.ts` implements a global cached connection with `maxPoolSize: 10`, `serverSelectionTimeoutMS: 5000`, and `socketTimeoutMS: 45000` to prevent Atlas M0 connection exhaustion.
- **Incremental Static Regeneration (ISR)**: Public catalog pages (`/`, `/originals`, `/prints`, `/artwork/[slug]`) use ISR (`revalidate = 60`) for instant page loads.
- **Instant Cache Revalidation**: Mutations in `/api/artworks` trigger `revalidatePath(...)` to instantly purge cached pages when artworks are added, modified, or marked as sold.
- **Anti-Spam Honeypot & Rate Limiting**: Both `/api/inquiries` and `/api/subscribers` are protected by hidden honeypot fields to trap bots and in-memory sliding-window rate limiters returning HTTP 429 upon abuse.
- **SEO & Social Sharing**:
  - Full Open Graph and Twitter Card tags across every public route.
  - Dynamic `sitemap.xml` generated at [`app/sitemap.ts`](app/sitemap.ts) with ISR.
  - Standard `robots.txt` generated at [`app/robots.ts`](app/robots.ts).
  - Schema.org `Product` JSON-LD structured data on artwork detail pages.
- **Accessibility (WCAG 2.1)**:
  - Screen reader "Skip to main content" link at the top of the body.
  - Descriptive `alt` text on every image.
  - Standard `<label htmlFor="...">` attributes on all form fields.
  - Mobile menu and cart drawer support `Escape` key dismissal and full ARIA modal dialog roles.
  - Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-sage`) on all interactive controls.

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint

# Seed MongoDB Atlas with sample artworks
npm run seed

# Build production bundle
npm run build

# Start production server
npm start
```
