import React, { useState, useEffect } from 'react';
import { PlusCircle, X, ExternalLink, Gift } from 'lucide-react';
import { WishlistItem, Category, SortOption } from './types';
import { 
  getWishlistItems, 
  getCategories, 
  addWishlistItem, 
  updateWishlistItem,
  deleteWishlistItem,
  reserveItem,
  clearReservation
} from './utils/storage';
import { isSharedView } from './utils/sharing';
import Header from './components/Header';
import WishlistForm from './components/WishlistForm';
import CategoryFilter from './components/CategoryFilter';
import EmptyState from './components/EmptyState';
import SearchSort from './components/SearchSort';

function App() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('dateAdded');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const isShared = isSharedView();
  
  useEffect(() => {
    refreshItems();
    setCategories(getCategories());
    document.title = isShared ? 'Shared Wishlist - Wishify' : 'My Wishlist - Wishify';
  }, []);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
  const refreshItems = () => {
    setItems(getWishlistItems());
  };
  
  const handleAddItem = (newItem: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    addWishlistItem(newItem);
    refreshItems();
    setShowForm(false);
  };
  
  const handleEditItem = (item: WishlistItem) => {
    setIsEditing(true);
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleUpdateItem = (updatedItem: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    if (editingItem) {
      const itemToUpdate = {
        ...updatedItem,
        id: editingItem.id,
        dateAdded: editingItem.dateAdded
      };
      updateWishlistItem(itemToUpdate);
      refreshItems();
      setShowForm(false);
      setIsEditing(false);
      setEditingItem(undefined);
    }
  };
  
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteWishlistItem(id);
      refreshItems();
    }
  };
  
  const handleReserveItem = (id: string) => {
    const name = prompt('Please enter your name:');
    if (name) {
      reserveItem(id, name);
      refreshItems();
    }
  };
  
  const handleClearReservation = (id: string) => {
    clearReservation(id);
    refreshItems();
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingItem(undefined);
  };
  
  const filteredAndSortedItems = React.useMemo(() => {
    let result = [...items];
    
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    switch (sortOption) {
      case 'dateAdded':
        return result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      default:
        return result;
    }
  }, [items, selectedCategory, searchTerm, sortOption]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-200`}>
      <Header isShared={isShared} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!isShared && (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 text-transparent bg-clip-text animate-gradient">
              My Wishlist
            </h2>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Item
              </button>
            )}
            
            {showForm && (
              <button
                onClick={handleCancelForm}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-500/50 hover:bg-gray-600/50 text-white font-medium backdrop-blur-sm transition-all"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        )}
        
        {showForm && (
          <div className="mb-8">
            <WishlistForm 
              onSubmit={isEditing ? handleUpdateItem : handleAddItem}
              categories={categories}
              initialItem={editingItem}
              onCancel={handleCancelForm}
              isEdit={isEditing}
            />
          </div>
        )}
        
        {items.length > 0 && (
          <>
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <SearchSort 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
            
            <div className="space-y-4">
              {filteredAndSortedItems.map(item => {
                const category = categories.find(c => c.id === item.category);
                return (
                  <div
                    key={item.id}
                    className={`relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-gray-700/20 shadow-sm transition-all hover:shadow-md ${
                      item.reserved ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h3>
                            
                            <div className="flex items-center gap-2 mt-1">
                              {category && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${category.color}20`,
                                    color: category.color,
                                    borderLeft: `2px solid ${category.color}`
                                  }}
                                >
                                  {category.name}
                                </span>
                              )}
                              
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.priority === 'high'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                  : item.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="mt-4 flex items-center gap-3">
                          {item.purchaseLink && (
                            <a
                              href={item.purchaseLink}
                              target="_blank"
                              rel="noop
ener noreferrer"
                              className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Item
                            </a>
                          )}
                          
                          {!isShared && !item.reserved && (
                            <>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                              >
                                Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          
                          {isShared && !item.reserved && (
                            <button
                              onClick={() => handleReserveItem(item.id)}
                              className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            >
                              <Gift className="h-4 w-4 mr-1" />
                              I'll get this!
                            </button>
                          )}
                          
                          {item.reserved && (
                            <div className="flex items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Reserved by {item.reservedBy}
                              </span>
                              
                              {!isShared && (
                                <button
                                  onClick={() => handleClearReservation(item.id)}
                                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                  (Clear)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {items.length === 0 ? (
          <EmptyState onAdd={() => setShowForm(true)} />
        ) : filteredAndSortedItems.length === 0 ? (
          <EmptyState isFiltered={true} />
        ) : null}
      </main>
      
      <footer className="py-6 px-4 mt-12 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Wishify | The easiest way to share your wishlist with loved ones
        </div>
      </footer>
    </div>
  );
}

export default App;