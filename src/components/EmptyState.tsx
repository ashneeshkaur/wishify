import React from 'react';
import { Gift, PlusCircle } from 'lucide-react';
import { isSharedView } from '../utils/sharing';

interface EmptyStateProps {
  onAdd?: () => void;
  isFiltered?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAdd, isFiltered = false }) => {
  const isShared = isSharedView();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-lg">
        <Gift className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
        
        {isShared && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              This wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              The owner of this wishlist hasn't added any items yet. Check back later!
            </p>
          </>
        )}
        
        {!isShared && isFiltered && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              No items match your current filter. Try selecting a different category or clearing your filter.
            </p>
          </>
        )}
        
        {!isShared && !isFiltered && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Start adding items to your wishlist that you'd like to receive as gifts!
            </p>
            
            {onAdd && (
              <button
                onClick={onAdd}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Your First Item
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;