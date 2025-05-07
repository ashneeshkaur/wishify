export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  purchaseLink: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  reserved: boolean;
  reservedBy?: string;
  dateAdded: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type SortOption = 'dateAdded' | 'price-asc' | 'price-desc' | 'priority';