import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import useInventory from '@/hooks/useInventory';

export const InventoryView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, loading, error, initSheet, fetchItems } = useInventory();
  
  const [initializing, setInitializing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const initRef = useRef(false);

  // Initialize and fetch item data - runs only once on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      try {
        setInitializing(true);
        await initSheet();
        await fetchItems();
      } catch (err) {
        console.error('Failed to initialize:', err);
      } finally {
        setInitializing(false);
      }
    };
    initialize();
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (loading || initializing) {
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
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/inventory/page1')}
            className="gap-2 border-blue-200 bg-white hover:bg-blue-50 text-blue-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Inventory Overview</h1>
          <p className="text-gray-500 text-sm sm:text-base">View all items and their quantities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-sm sm:text-base border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
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
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No items found matching your search' : 'No items in inventory'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/inventory/item/${encodeURIComponent(item.itemName)}`)}
                className="bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer overflow-hidden group"
              >
                {/* Item Image */}
                <div className="relative w-full h-40 sm:h-38 bg-blue-50 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 ">
                    {item.itemName}
                  </h3>

                  {/* Quantity Display */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      Quantity in Stock
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-blue-600">{item.quantity}</p>
                      <p className="text-sm text-blue-500">Units</p>
                    </div>
                  </div>

                  {/* Click to Edit Hint */}
                  <p className="text-xs text-gray-400 text-center mt-3">Click to adjust quantity</p>
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
