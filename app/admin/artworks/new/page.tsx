import React from 'react';
import type { Metadata } from 'next';
import { ArtworkForm } from '@/components/admin/ArtworkForm';

export const metadata: Metadata = {
  title: 'Add New Artwork — Studio Admin',
};

export default function NewArtworkPage() {
  return <ArtworkForm isNew={true} />;
}
