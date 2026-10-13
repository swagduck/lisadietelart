import React from 'react';
import type { Metadata } from 'next';
import { ArtworkForm } from '@/components/admin/ArtworkForm';

interface EditArtworkPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Edit Artwork — Studio Admin',
};

export default function EditArtworkPage({ params }: EditArtworkPageProps) {
  return <ArtworkForm initialId={params.id} isNew={false} />;
}
