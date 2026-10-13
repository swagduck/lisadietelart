import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/components/shop/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const CartDrawer = dynamic(
  () => import('@/components/shop/CartDrawer').then((mod) => mod.CartDrawer),
  { ssr: false }
);

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lisadietelart.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lisa Dietel — Fine Art & Studio',
    template: '%s | Lisa Dietel Art',
  },
  description:
    'Contemporary painter exploring atmospheric horizons, memory, and silence on raw Belgian linen. Original paintings, archival prints, and bespoke commissions.',
  keywords: [
    'Lisa Dietel',
    'independent painter',
    'oil painting',
    'fine art portfolio',
    'art prints',
    'original paintings',
    'archival pigment prints',
    'art commissions',
  ],
  authors: [{ name: 'Lisa Dietel' }],
  creator: 'Lisa Dietel',
  openGraph: {
    title: 'Lisa Dietel — Fine Art & Studio',
    description:
      'Contemporary painter exploring atmospheric horizons, memory, and silence on raw Belgian linen. Original paintings, archival prints, and bespoke commissions.',
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Lisa Dietel Art',
    images: [
      {
        url: '/images/nocturne-in-ochre.svg',
        width: 1200,
        height: 630,
        alt: 'Lisa Dietel Studio — Fine Art & Paintings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lisa Dietel — Fine Art & Studio',
    description:
      'Contemporary painter exploring atmospheric horizons, memory, and silence on raw Belgian linen.',
    images: ['/images/nocturne-in-ochre.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${jost.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased selection:bg-blush/60 selection:text-ink">
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:uppercase focus:tracking-widest focus:text-paper focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-sage"
        >
          Skip to main content
        </a>
        <CartProvider>
          <div className="flex min-h-screen flex-col justify-between">
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
