# Leftover Placeholders and Content Replacement Guide

This document catalogs all sample content, placeholder text, invented studio locations, mock names, example email addresses, and domain fallbacks throughout the codebase so the site owner can easily review and replace them with real information.

---

## 1. Artist Name & Branding
- **Artist Name:** `Lisa Dietel`
  - Found in: Page metadata titles, Open Graph tags, footer copyright (`Lisa Dietel Fine Art`), navbar header (`Lisa Dietel Studio & Archive`), bio copy (`app/about/page.tsx`), and email subjects.
- **Legacy Mock Name:** `Aura Vance`
  - Previously present in prototype markup and localStorage keys (now migrated to `lisa_dietel_cart_v1`).

---

## 2. Studio Name & Physical Locations
- **Invented Studio Name:** `"Hudson studio"`
  - `components/home/SelectedWorkGrid.tsx`: `"Original paintings and archival print editions from the Hudson studio."`
- **Invented Studio Address / Region:**
  - `app/contact/page.tsx`: `"Hudson, NY 12534"` and `"studio appointments in Hudson, NY"`
  - `components/contact/ContactSection.tsx`: `"or studio viewings in Hudson, NY."`

---

## 3. Contact Details & Social Media
- **Studio Inquiries Email:** `studio@lisadietelart.com`
  - Used in: `app/contact/page.tsx`, `components/layout/Footer.tsx`, `components/layout/Navbar.tsx`, `app/artwork/[slug]/page.tsx` mailto links.
- **Example / Form Placeholder Emails:**
  - `eleanor@example.com`: Placeholder in `components/commissions/CommissionForm.tsx` and `components/contact/ContactSection.tsx`.
  - `collector@example.com`: Placeholder in `components/layout/NewsletterForm.tsx`.
- **Social Media Handle:** `@lisadietelart`
  - Used in: `components/layout/Footer.tsx` (`Instagram · @lisadietelart`).

---

## 4. Domains & Localhost URLs
- **Localhost Fallbacks:** `http://localhost:3000`
  - Used in `.env.example` as `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- **Production Domain Fallback:** `https://lisadietelart.com`
  - Used in: `app/layout.tsx`, `app/artwork/[slug]/page.tsx`, `app/robots.ts`, `app/sitemap.ts` when `process.env.NEXT_PUBLIC_SITE_URL` is unset.

---

## 5. Sample Catalog Artworks (`lib/data.ts` & `scripts/seed.ts`)
The default seed catalog contains 8 mock artworks with fictional descriptions, stories, dimensions, and prices:
1. **Nocturne in Ochre** (Original, \$4,200, 48 × 60 in, Oil on raw Belgian linen)
2. **The Breath of Dawn** (Original, \$2,800, 30 × 40 in, Cold wax & chalk on linen)
3. **Coastal Solitude** (Original, \$3,400, 36 × 48 in, Earth pigments and walnut oil on Belgian linen)
4. **Silence & Water** (Print edition, \$340, 24 × 32 in, Archival pigment print on Hahnemühle paper)
5. **Earthen Soliloquy** (Original, \$5,100, 54 × 66 in, Raw sienna, graphite, and marble dust on linen)
6. **Resonance in Sage** (Print edition, \$280, 20 × 28 in, Archival pigment print on 310gsm cotton rag)
7. **Morning Mist Print** (Print edition, \$240, 18 × 24 in, Archival pigment print)
8. **Detail Nocturne** (Macro photography study)

---

## 6. Sample Exhibitions CV (`lib/data.ts`)
The exhibition list in `app/about/page.tsx` references fictional solo and group exhibitions:
- **The Quiet Horizon (2025)** — Solo Exhibition, Tonalist Contemporary, New York
- **Earth & Resonance (2024)** — Group Invitational, Gallery Stillness, Hudson, NY
- **Atmospheric Memory (2023)** — Solo Showcase, Mineral & Canvas, Boston
- **Forms of Stillness (2022)** — Juried Biennial, Northeastern Fine Arts Foundation

---

## 7. Sample Testimonials (`lib/data.ts`)
Collector quotes on the homepage:
- **Eleanor & Marcus Vance** (Hudson, NY): Private collector commission quote.
- **Julian Thorne** (London, UK): Architectural interior designer acquisition quote.
- **Dr. Sophia Al-Mansoor** (Zurich, Switzerland): Living space installation quote.
