import { nanoid } from 'nanoid';

const SHARE_ID_KEY = 'wishlist-share-id';

export const generateShareLink = (): string => {
  // Get or create a persistent share ID
  let shareId = localStorage.getItem(SHARE_ID_KEY);
  if (!shareId) {
    shareId = nanoid(10);
    localStorage.setItem(SHARE_ID_KEY, shareId);
  }
  
  const url = new URL(window.location.href);
  url.searchParams.set('list', shareId);
  return url.toString();
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const isSharedView = (): boolean => {
  const url = new URL(window.location.href);
  return url.searchParams.has('list');
};

export const getShareId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('list');
};