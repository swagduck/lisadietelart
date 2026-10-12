import React from 'react';
import { Hero } from '@/components/hero/Hero';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';
import { AboutSection } from '@/components/about/AboutSection';
import { ExhibitionList } from '@/components/exhibitions/ExhibitionList';
import { ContactSection } from '@/components/contact/ContactSection';
import { ARTWORKS_DATA, EXHIBITIONS_DATA } from '@/lib/data';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ArtworkGrid artworks={ARTWORKS_DATA} />
      <AboutSection />
      <ExhibitionList exhibitions={EXHIBITIONS_DATA} />
      <ContactSection />
    </>
  );
}
