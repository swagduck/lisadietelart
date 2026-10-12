import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/shop/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lisa Dietel — Fine Art & Studio',
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
  openGraph: {
    title: 'Lisa Dietel — Fine Art & Studio',
    description:
      'Contemporary painter exploring atmospheric horizons, memory, and silence on raw Belgian linen. Original paintings, archival prints, and bespoke commissions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lisa Dietel Art',
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
      <body className="min-h-screen bg-paper text-ink antialiased selection:bg-blush/60 selection:text-ink">
        <CartProvider>
          <div className="flex min-h-screen flex-col justify-between">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
