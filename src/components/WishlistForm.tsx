import React, { useState, useEffect } from 'react';
import { WishlistItem, Category } from '../types';
import { Image, Loader2 } from 'lucide-react';

interface WishlistFormProps {
  onSubmit: (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => void;
  categories: Category[];
  initialItem?: WishlistItem;
  onCancel: () => void;
  isEdit?: boolean;
}

const WishlistForm: React.FC<WishlistFormProps> = ({
  onSubmit,
  categories,
  initialItem,
  onCancel,
  isEdit = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [purchaseLink, setPurchaseLink] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setDescription(initialItem.description);
      setPrice(initialItem.price.toString());
      setImageUrl(initialItem.imageUrl);
      setPurchaseLink(initialItem.purchaseLink);
      setCategory(initialItem.category);
      setPriority(initialItem.priority);
    }
  }, [initialItem]);

  const handlePurchaseLinkChange = async (url: string) => {
    setPurchaseLink(url);
    if (!imageUrl && url) {
      setIsLoadingImage(true);
      setImageError(null);
      try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const ogImage = doc.querySelector('meta[property="og:image"]');
        if (ogImage) {
          const imgUrl = ogImage.getAttribute('content');
          if (imgUrl) {
            setImageUrl(imgUrl);
          }
        }
      } catch (error) {
        setImageError('Could not fetch image from URL');
      } finally {
        setIsLoadingImage(false);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      purchaseLink,
      category,
      priority,
      reserved: initialItem?.reserved || false,
      reservedBy: initialItem?.reservedBy
    };
    
    onSubmit(newItem);
    
    if (!isEdit) {
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setPurchaseLink('');
      setCategory('');
      setPriority('medium');
    }
  };
  
  return (
    <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl p-6 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {isEdit ? 'Edit Wishlist Item' : 'Add to Your Wishlist'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Item Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
            placeholder="What do you wish for?"
          />
        </div>
        
        <div>
          <label htmlFor="purchaseLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Purchase Link *
          </label>
          <div className="relative">
            <input
              id="purchaseLink"
              type="url"
              value={purchaseLink}
              onChange={(e) => handlePurchaseLinkChange(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
              placeholder="https://example.com/product"
            />
            {isLoadingImage && (
              <div className="absolute right-3 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <div className="relative">
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <div className="absolute right-3 top-2">
                <Image className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          {imageError && (
            <p className="mt-1 text-sm text-red-500">{imageError}</p>
          )}
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg"
                onError={() => setImageError('Invalid image URL')}
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price (USD) *
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm dark:text-white"
            placeholder="Add some details about this item..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="flex gap-4">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <label key={p} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="mr-2"
                />
                <span className="capitalize text-gray-700 dark:text-gray-300">{p}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            {isEdit ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WishlistForm;