import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, X, ArrowUpDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import axios from '@/plugin/axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface InventoryItem {
  id: number;
  name: string;
  img?: string;
  url?: string;
  quantity: number;
  has_sizes?: boolean;
  size_quantities?: { [key: string]: number };
  location?: string;
  date_created: string;
  date_updated: string;
}

export const InventoryView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'quantity-asc' | 'quantity-desc' | 'date-newest' | 'date-oldest'>('name-asc');

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<InventoryItem[]>('inventory/items/');
        setItems(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load items');
        console.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated]);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'quantity-asc':
        return a.quantity - b.quantity;
      case 'quantity-desc':
        return b.quantity - a.quantity;
      case 'date-newest':
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
      case 'date-oldest':
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
      default:
        return 0;
    }
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-lg text-gray-700 font-bold">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="text-center">
          {/* Unique Animated Loader */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400 animate-spin"></div>
            {/* Middle rotating ring */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-lg text-gray-700 font-bold">Loading inventory...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 pb-8 relative overflow-hidden">
      {/* Minimal background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
 

        {/* Title */}
        <div className="mb-8 md:mb-6 sm:mb-5">
          <h1 className="text-3xl md:text-2xl sm:text-xl font-bold text-gray-900 mb-2">Inventory Overview</h1>
          <p className="text-gray-500 text-base md:text-sm sm:text-xs">View all items and their quantities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 md:mb-6 sm:mb-5 relative">
          <div className="flex gap-3 md:gap-2 sm:gap-2 mb-3 md:mb-2 sm:mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-4 md:h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 md:py-2 sm:py-2 text-base md:text-sm sm:text-xs border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 md:w-4 md:h-4" />
                </button>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="px-4 md:px-3 sm:px-3 py-3 md:py-2 sm:py-2 border-2 border-blue-200 hover:border-blue-300 bg-white"
                >
                  <ArrowUpDown className="w-5 h-5 md:w-4 md:h-4 sm:w-4 sm:h-4" />
                  <span className="ml-2 text-base md:text-sm sm:text-xs md:hidden">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 md:w-44 sm:w-40">
                <DropdownMenuItem 
                  onClick={() => setSortBy('name-asc')}
                  className={`cursor-pointer ${sortBy === 'name-asc' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Name (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('name-desc')}
                  className={`cursor-pointer ${sortBy === 'name-desc' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Name (Z-A)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('quantity-desc')}
                  className={`cursor-pointer ${sortBy === 'quantity-desc' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Quantity (High-Low)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('quantity-asc')}
                  className={`cursor-pointer ${sortBy === 'quantity-asc' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Quantity (Low-High)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('date-newest')}
                  className={`cursor-pointer ${sortBy === 'date-newest' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Date (Newest First)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('date-oldest')}
                  className={`cursor-pointer ${sortBy === 'date-oldest' ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <span className="text-sm md:text-xs sm:text-xs">Date (Oldest First)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {searchQuery && (
            <p className="text-sm md:text-xs sm:text-xs text-gray-500 mt-2">
              Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-300 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Items Grid or List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 md:py-10 sm:py-8">
            <Package className="w-16 h-16 md:w-14 md:h-14 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg md:text-base sm:text-sm">
              {searchQuery ? 'No items found matching your search' : 'No items in inventory'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 md:gap-3 sm:gap-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/inventory/item/${item.id}`)}
                className="bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer overflow-hidden group"
              >
                {/* Item Image */}
                <div className="relative w-full h-40 md:h-36 sm:h-32 bg-blue-50 overflow-hidden">
                  {item.img ? (
                    <img
                      src={`${item.img}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <span className="text-4xl md:text-3xl sm:text-2xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="p-4 md:p-3 sm:p-3">
                  <h3 className="text-lg md:text-base sm:text-sm font-bold text-gray-900 mb-3 md:mb-2 sm:mb-2">
                    {item.name}
                  </h3>

                  {/* Quantity Display */}
                  <div className="p-3 md:p-2 sm:p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs md:text-xs sm:text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      Quantity in Stock
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl md:text-2xl sm:text-xl font-bold text-blue-600">{item.quantity}</p>
                      <p className="text-sm md:text-xs sm:text-xs text-blue-500">Units</p>
                    </div>
                  </div>

                  {/* Click to Edit Hint */}
                  <p className="text-xs md:text-xs sm:text-[10px] text-gray-400 text-center mt-3 md:mt-2 sm:mt-2">Click to adjust quantity</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Footer */}
       
      </div>
    </div>
  );
};

export default InventoryView;
