import { WishlistItem, Category } from '../types';
import { getShareId } from './sharing';

const STORAGE_KEY = 'wishlist-items';
const CATEGORIES_KEY = 'wishlist-categories';

const defaultCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', color: '#3B82F6' },
  { id: 'clothing', name: 'Clothing', color: '#F97316' },
  { id: 'books', name: 'Books', color: '#14B8A6' },
  { id: 'home', name: 'Home', color: '#8B5CF6' },
  { id: 'beauty', name: 'Beauty', color: '#EC4899' },
  { id: 'other', name: 'Other', color: '#6B7280' },
];

const getStorageKey = () => {
  const shareId = getShareId();
  return shareId ? `${STORAGE_KEY}-${shareId}` : STORAGE_KEY;
};

export const getWishlistItems = (): WishlistItem[] => {
  const key = getStorageKey();
  const storedItems = localStorage.getItem(key);
  return storedItems ? JSON.parse(storedItems) : [];
};

export const saveWishlistItems = (items: WishlistItem[]): void => {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(items));
};

export const getCategories = (): Category[] => {
  const storedCategories = localStorage.getItem(CATEGORIES_KEY);
  if (storedCategories) {
    return JSON.parse(storedCategories);
  } else {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
};

export const addWishlistItem = (item: Omit<WishlistItem, 'id' | 'dateAdded'>): WishlistItem => {
  const newItem: WishlistItem = {
    ...item,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  
  const items = getWishlistItems();
  items.push(newItem);
  saveWishlistItems(items);
  return newItem;
};

export const updateWishlistItem = (updatedItem: WishlistItem): void => {
  const items = getWishlistItems();
  const index = items.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    items[index] = updatedItem;
    saveWishlistItems(items);
  }
};

export const deleteWishlistItem = (id: string): void => {
  const items = getWishlistItems();
  const filteredItems = items.filter(item => item.id !== id);
  saveWishlistItems(filteredItems);
};

export const reserveItem = (id: string, name: string): void => {
  const items = getWishlistItems();
  const item = items.find(item => item.id === id);
  
  if (item) {
    item.reserved = true;
    item.reservedBy = name;
    saveWishlistItems(items);
  }
};

export const clearReservation = (id: string): void => {
  const items = getWishlistItems();
  const item = items.find(item => item.id === id);
  
  if (item) {
    item.reserved = false;
    item.reservedBy = undefined;
    saveWishlistItems(items);
  }
};