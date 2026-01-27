import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Minus, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import useInventory, { InventoryItem } from '@/hooks/useInventory';

export const ItemDetail = () => {
  const { itemName } = useParams<{ itemName: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, loading, error, initSheet, fetchItems, addQuantity, removeQuantity } = useInventory();
  
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [quantityInput, setQuantityInput] = useState(1);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const initRef = useRef(false);
  const submitRef = useRef(false);

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

  // Find the item from the list
  useEffect(() => {
    if (itemName && items.length > 0) {
      const foundItem = items.find(
        (i) => i.itemName.toLowerCase() === decodeURIComponent(itemName).toLowerCase()
      );
      if (foundItem) {
        setItem(foundItem);
      }
    }
  }, [itemName, items]);

  const handleAddQuantity = async () => {
    if (submitting || submitRef.current) return;
    if (!item || quantityInput <= 0) {
      setActionMessage({ type: 'error', message: 'Please enter a valid quantity' });
      return;
    }

    try {
      submitRef.current = true;
      setSubmitting(true);
      await addQuantity(item.itemName, quantityInput);
      setActionMessage({ type: 'success', message: `Added ${quantityInput} to inventory!` });
      setQuantityInput(1);
    } catch (err) {
      setActionMessage({ type: 'error', message: 'Failed to update quantity' });
      console.error('Failed to add quantity:', err);
    } finally {
      setSubmitting(false);
      submitRef.current = false;
    }
  };

  const handleRemoveQuantity = async () => {
    if (submitting || submitRef.current) return;
    if (!item || quantityInput <= 0) {
      setActionMessage({ type: 'error', message: 'Please enter a valid quantity' });
      return;
    }

    try {
      submitRef.current = true;
      setSubmitting(true);
      await removeQuantity(item.itemName, quantityInput);
      setActionMessage({ type: 'success', message: `Removed ${quantityInput} from inventory!` });
      setQuantityInput(1);
    } catch (err) {
      setActionMessage({ type: 'error', message: 'Failed to update quantity' });
      console.error('Failed to remove quantity:', err);
    } finally {
      setSubmitting(false);
      submitRef.current = false;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50">
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br ">
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
          <p className="text-lg text-gray-700 font-bold">Loading item details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Item Not Found</h1>
          <p className="text-gray-600 mb-8">
            The item "<strong>{decodeURIComponent(itemName || '')}</strong>" could not be found in your inventory.
          </p>
          <Button onClick={() => navigate('/inventory/view')} className="bg-blue-600 hover:bg-blue-700">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to View
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-6 sm:mt-4 p-4 pt-0 pb-8 relative overflow-hidden">
      {/* Minimal background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 fixed z-50 left-10 top-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/inventory/view')}
            className="gap-2 border-blue-200 bg-white hover:bg-blue-50 text-blue-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Main Card - Minimal Design */}
        <div className="bg-white rounded-2xl sm:mt-3 shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
          {/* Item Image */}
          <div className="relative w-full h-48 sm:h-48 bg-blue-50 overflow-hidden border-b border-blue-100">
            {item.image ? (
              <img
                src={item.image}
                alt={item.itemName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl mb-2">📦</div>
                  <span className="text-blue-400 text-sm sm:text-lg font-medium">No Image Available</span>
                </div>
              </div>
            )}
          </div>

          {/* Item Content */}
          <div className="p-4 sm:p-4">
            {/* Item Title */}
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">{item.itemName}</h1>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">Inventory Management</p>
            
            {/* Current Quantity Card */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Current Stock</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl sm:text-5xl font-bold text-blue-600">{item.quantity}</p>
                <p className="text-sm sm:text-base text-blue-500 font-medium">Units</p>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-300 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-red-900">Error</p>
                  <p className="text-xs sm:text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {actionMessage && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 border-l-4 ${
                  actionMessage.type === 'success'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                {actionMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`font-medium ${actionMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {actionMessage.message}
                </p>
              </div>
            )}

            {/* Quantity Input Section */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Quantity to Adjust
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Decrease Button */}
                <button
                  onClick={() => setQuantityInput(Math.max(1, quantityInput - 1))}
                  disabled={quantityInput <= 1 || submitting}
                  className="flex-shrink-0 h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold text-lg sm:text-xl transition-colors disabled:opacity-30 
                  bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg"
                >
                  −
                </button>

                {/* Input Field */}
                <Input
                  type="number"
                  min="1"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Qty"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />

                {/* Increase Button */}
                <button
                  onClick={() => setQuantityInput(quantityInput + 1)}
                  disabled={submitting}
                  className="flex-shrink-0 h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold text-lg sm:text-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed 
                  bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  +
                </button>
              </div>
           
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
              <Button
                onClick={handleAddQuantity}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-4 text-xs sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">Adding</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="sm:hidden inline">Add Item</span>
                    <span className="sm:inline">Add</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleRemoveQuantity}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-4 text-xs sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">Deducting</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="sm:hidden inline">Remove Item</span>
                    <span className="sm:inline">Remove</span>
                  </>
                )}
              </Button>
            </div>

            {/* Info Message */}
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-gray-700 text-center">
                💡 <strong>Tip:</strong> Enter the quantity and click the appropriate button to update your inventory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
