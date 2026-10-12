export type CartItemType = 'original' | 'print';

export interface ICartItem {
  id: string; // unique cart item id (e.g. artworkId-type-size)
  artworkId: string;
  title: string;
  slug: string;
  type: CartItemType;
  variant?: string; // e.g. "Archival Print 16 × 20 in"
  price: number;
  imageUrl: string;
  quantity: number;
  medium: string;
}

export interface ICartContext {
  items: ICartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<ICartItem, 'quantity' | 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}
