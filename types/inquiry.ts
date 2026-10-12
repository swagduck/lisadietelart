export interface IInquiry {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  artworkTitle?: string;
  artworkId?: string;
  subject: string;
  message: string;
  type:
    | 'artwork_inquiry'
    | 'commission'
    | 'gallery_representation'
    | 'studio_visit'
    | 'general';
  createdAt?: string;
}

export interface IExhibition {
  year: number;
  title: string;
  venue: string;
  location: string;
  type: 'Solo Exhibition' | 'Group Exhibition' | 'Art Fair' | 'Biennial';
  status?: string;
}
