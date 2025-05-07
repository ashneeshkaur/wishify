import React, { useState } from 'react';
import { 
  ExternalLink, 
  Euro, 
  Gift, 
  User,
  TrashIcon,
  Edit
} from 'lucide-react';
import { WishlistItem, Category } from '../types';
import { isSharedView } from '../utils/sharing';
import { reserveItem, clearReservation, deleteWishlistItem } from '../utils/storage';

interface ItemCardProps {
  item: WishlistItem;
  categories: Category[];
  onEdit: (item: WishlistItem) => void;
  refreshItems: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  categories,
  onEdit,
  refreshItems
}) => {
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isShared = isSharedView();
  const category = categories.find(c => c.id === item.category);
  
  const priorityColors = {
    low: 'bg-blue-200/40 text-blue-800',
    medium: 'bg-yellow-200/40 text-yellow-800',
    high: 'bg-rose-200/40 text-rose-800',
  };
  
  const handleReserve = () => {
    if (reserveName.trim()) {
      reserveItem(item.id, reserveName);
      setReserveModalOpen(false);
      refreshItems();
    }
  };
  
  const handleClearReservation = () => {
    clearReservation(item.id);
    refreshItems();
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteWishlistItem(item.id);
      refreshItems();
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EURO',
    }).format(price);
  };
  
  return (
    <div 
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'h-auto' : 'h-[400px]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg z-0"></div>
      
      <div className="relative p-4 h-full flex flex-col z-10">
        <div className="relative h-48 rounded-lg overflow-hidden mb-4 bg-gray-200">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100/50">
              <Gift className="h-12 w-12 text-indigo-300" />
            </div>
          )}
          
          {item.reserved && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white font-bold mb-1">Reserved</div>
                <div className="text-white/80 text-sm">by {item.reservedBy}</div>
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[item.priority]}`}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
            {category && (
              <span 
                className="text-xs px-2 py-1 rounded-full bg-white/40"
                style={{ color: category.color, borderLeft: `2px solid ${category.color}` }}
              >
                {category.name}
              </span>
            )}
          </div>
          
          <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
            {isExpanded 
              ? item.description 
              : item.description.length > 100 
                ? `${item.description.substring(0, 100)}...` 
                : item.description}
          </div>
          
          <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300 flex items-center mb-4">
            <Euro className="h-4 w-4 mr-1" />
            {formatPrice(item.price)}
          </div>
          
          <div className="mt-auto flex flex-wrap gap-2">
            {item.purchaseLink && (
              <a 
                href={item.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm hover:bg-indigo-200 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Purchase Link
              </a>
            )}
            
            {item.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            {!isShared && !item.reserved && (
              <>
                <button
                  onClick={() => onEdit(item)}
                  className="flex items-center px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-700 text-sm hover:bg-indigo-500/30 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-700 text-sm hover:bg-rose-500/30 transition-colors"
                >
                  <TrashIcon className="h-3.5 w-3.5 mr-1" />
                  Delete
                </button>
              </>
            )}
            
            {isShared && !item.reserved && (
              <button
                onClick={() => setReserveModalOpen(true)}
                className="flex items-center px-3 py-1.5 rounded-full bg-green-500/20 text-green-700 text-sm hover:bg-green-500/30 transition-colors"
              >
                <Gift className="h-3.5 w-3.5 mr-1" />
                I'll get this!
              </button>
            )}
            
            {isShared && item.reserved && item.reservedBy && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-3.5 w-3.5 mr-1" />
                Reserved by {item.reservedBy}
              </div>
            )}
            
            {!isShared && item.reserved && (
              <button
                onClick={handleClearReservation}
                className="flex items-center px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors"
              >
                <User className="h-3.5 w-3.5 mr-1" />
                Clear reservation ({item.reservedBy})
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Reserve Modal */}
      {reserveModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-white/90 backdrop-blur-xl p-6 rounded-xl border border-white/30 shadow-xl max-w-md w-full">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setReserveModalOpen(false)}
            >
              &times;
            </button>
            
            <h3 className="text-xl font-semibold mb-4">Reserve "{item.name}"</h3>
            <p className="mb-4 text-gray-700">Let them know you'll be getting this gift!</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={reserveName}
                onChange={(e) => setReserveName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReserveModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                disabled={!reserveName.trim()}
                className={`px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 ${
                  !reserveName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;