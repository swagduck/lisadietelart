# Performance & Production-Readiness Report

This document tracks performance, bundle size, and quality metrics before and after the full production-readiness audit and optimization pass for Vercel Hobby tier.

---

## Phase 0: Baseline Metrics (Before Optimization)

### 1. First-Load JavaScript per Route (Baseline `next build`)

- **Shared by all routes:** 87.3 kB
  - `chunks/117-41b28f87b84c9b63.js`: 31.7 kB
  - `chunks/fd9d1056-60ab8e5874e95dfc.js`: 53.6 kB
  - Other shared chunks: 1.95 kB
- **Middleware:** 31.7 kB

| Route | Route Size | First Load JS | Target (< 120 kB public) |
|---|---|---|---|
| `/` (Home) | 2.16 kB | **124 kB** | Exceeds target (+4 kB) |
| `/_not-found` | 167 B | 87.5 kB | Pass |
| `/about` | 813 B | 102 kB | Pass |
| `/admin` | 9.74 kB | 106 kB | Pass |
| `/admin/artworks/[id]` | 142 B | 130 kB | Admin route |
| `/admin/artworks/new` | 142 B | 130 kB | Admin route |
| `/admin/login` | 2.42 kB | 98.4 kB | Pass |
| `/artwork/[slug]` | 3.86 kB | **126 kB** | Exceeds target (+6 kB) |
| `/commissions` | 3.21 kB | 95.6 kB | Pass |
| `/contact` | 1.71 kB | 89.0 kB | Pass |
| `/originals` | 2.15 kB | 110 kB | Pass |
| `/prints` | 2.15 kB | 110 kB | Pass |
| `/shop`, `/works` | 167 B | 87.5 kB | Pass |

---

### 2. Lighthouse Baseline Audits (Mobile, Throttled, `next start`)

*Test Environment: Microsoft Edge Headless, DevTools mobile throttling (simulated Slow 4G / 4x CPU slowdown), `next start` on production build.*

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| **`/` (Home)** | 90 | 93 | 96 | 100 | 1.9 s | 0.000 | 260 ms |
| **`/originals`** | 98 | 95 | 96 | 100 | 1.8 s | 0.001 | 60 ms |
| **`/prints`** | 99 | 95 | 96 | 100 | 1.8 s | 0.000 | 50 ms |
| **`/artwork/[slug]`** | 96 | 97 | 96 | 100 | 1.9 s | 0.000 | 160 ms |
| **`/commissions`** | 97 | 97 | 96 | 100 | 2.0 s | 0.001 | 120 ms |
| **`/about`** | 95 | 96 | 96 | 100 | 2.6 s | 0.000 | 120 ms |
| **`/contact`** | 97 | 96 | 96 | 100 | 1.9 s | 0.001 | 110 ms |
| **`/admin/login`** | 92 | 96 | 96 | 63* | 3.1 s | 0.000 | 130 ms |

*\*Note: `/admin/login` has SEO = 63 by design due to robots `noindex` directives on administrative endpoints.*

---

## Phase 5: Post-Optimization Metrics (To be populated in Phase 5)

*(A complete comparison table with delta metrics will be added here upon completion of Phases 1 through 5.)*
