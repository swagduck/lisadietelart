import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Admin | Lisa Dietel Art',
  description: 'Lisa Dietel Studio Management Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-blush selection:text-ink">
      {children}
    </div>
  );
}
