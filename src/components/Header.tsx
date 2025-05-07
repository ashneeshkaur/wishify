import React from 'react';
import { Gift, Share2 } from 'lucide-react';
import { generateShareLink, copyToClipboard } from '../utils/sharing';

interface HeaderProps {
  isShared: boolean;
  isDark: boolean;
  onToggleTheme: any;
}

const Header: React.FC<HeaderProps> = ({ isShared }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleShare = async () => {
    const shareLink = generateShareLink();
    const success = await copyToClipboard(shareLink);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <header className="py-6 px-4 md:px-8 backdrop-blur-md bg-white/10 sticky top-0 z-10 border-b border-white/20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">Wishify</h1>
        </div>
        
        <div className="flex items-center">
          {!isShared && (
            <button 
              onClick={handleShare}
              className="flex items-center px-4 py-2 rounded-full bg-indigo-500/80 hover:bg-indigo-600/80 text-white font-medium backdrop-blur-sm transition-all"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Share List'}
            </button>
          )}
          
          {isShared && (
            <div className="text-sm italic text-indigo-700 dark:text-indigo-300">
              Shared Wishlist View
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;