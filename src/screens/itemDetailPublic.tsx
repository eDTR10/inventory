import { useEffect, useState } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import axios from '@/plugin/axios';
import Swal from 'sweetalert2';

interface ItemDetailData {
  id: number;
  name: string;
  img?: string;
  url?: string;
  quantity: number;
  date_created: string;
  date_updated: string;
}

export const ItemDetailPage = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [item, setItem] = useState<ItemDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('0');
  const [holdInterval, setHoldInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchItem = async () => {
    if (!identifier) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ItemDetailData>(`inventory/public/item/${identifier}/`);
      setItem(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchItem();
    }
  }, [identifier, isAuthenticated]);

  const updateQuantity = async (action: 'add' | 'subtract', amount: number = 1) => {
    if (!item) return;
    
    setUpdating(true);
    try {
      const response = await axios.patch<ItemDetailData>(`inventory/public/item/${identifier}/`, {
        action,
        quantity: amount,
      });
      setItem(response.data);
      setCustomAmount('1'); // Reset to 1 after successful update
      
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `${action === 'add' ? 'Added' : 'Removed'} ${amount} item(s). New quantity: ${response.data.quantity}`,
        confirmButtonColor: '#2563eb',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to update quantity',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCustomUpdate = (action: 'add' | 'subtract') => {
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid positive number',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    // Show confirmation dialog
    Swal.fire({
      title: 'Confirm Action',
      text: `Are you sure you want to ${action === 'add' ? 'add' : 'remove'} ${amount} item(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'add' ? '#475569' : '#dc2626',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: action === 'add' ? 'Yes, Add' : 'Yes, Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        updateQuantity(action, amount);
      }
    });
  };

  const incrementAmount = () => {
    const current = parseInt(customAmount) || 0;
    setCustomAmount(String(current + 1));
  };

  const decrementAmount = () => {
    const current = parseInt(customAmount) || 0;
    if (current > 1) {
      setCustomAmount(String(current - 1));
    }
  };

  const startHold = (action: 'increment' | 'decrement') => {
    const fn = action === 'increment' ? incrementAmount : decrementAmount;
    fn(); // Execute immediately
    const interval = setInterval(fn, 100); // Then repeat every 100ms
    setHoldInterval(interval);
  };

  const stopHold = () => {
    if (holdInterval) {
      clearInterval(holdInterval);
      setHoldInterval(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-lg text-gray-700 font-bold">Loading item...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg max-w-md border border-blue-100">
          <Package className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/inventory/view')} className="bg-blue-600 hover:bg-blue-700 text-white transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 w-full flex items-center justify-center p-4 md:p-2 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>
      
      <Button 
        onClick={() => navigate('/inventory/view')} 
        variant="outline"
        className="absolute top-4 left-4 md:top-3 md:left-3 sm:top-2 sm:left-2 z-20 border-blue-200 bg-white hover:bg-blue-50 text-blue-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="md:hidden">View Inventory</span>
        <span className="hidden md:inline">Back</span>
      </Button>
      
      <div className="w-full max-w-md md:max-w-sm relative z-10">
        <div className="bg-white rounded-2xl md:rounded-xl shadow-lg overflow-hidden border border-blue-100">
          {/* Image Section */}

          {item.img && (
            <div className="relative w-full flex items-center justify-center overflow-hidden bg-blue-50">
              <img
                src={`${import.meta.env.VITE_URL}${item.img}`}
                alt={item.name}
                className="w-full max-h-64 md:max-h-48 object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 md:p-6 sm:p-4">
           
            <h1 className="text-3xl md:text-2xl sm:text-xl font-bold mb-8 md:mb-6 sm:mb-4 text-center text-gray-900">
              {item.name}
            </h1>

            {/* Quantity Display */}
            <div className="mb-8 md:mb-6 sm:mb-4">
              <div className="mb-6 md:mb-4 text-center">
                <div className="p-4 md:p-3 sm:p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Current Quantity</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <p className="text-6xl md:text-5xl sm:text-4xl font-bold text-blue-600">{item.quantity}</p>
                    <p className="text-lg md:text-base sm:text-sm text-blue-500">Units</p>
                  </div>
                </div>
              </div>

              {/* Custom Amount Input with +/- buttons */}
              <div className="space-y-4 md:space-y-3">
                <div>
                  <label className="block text-sm sm:text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                    Adjust Quantity
                  </label>
                  <div className="flex gap-2 items-center">
                    <Button
                      onMouseDown={() => startHold('decrement')}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() => startHold('decrement')}
                      onTouchEnd={stopHold}
                      disabled={updating}
                      variant="outline"
                      className="w-10 h-10 sm:w-8 sm:h-8 p-0 rounded-lg bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600"
                    >
                      <Minus className="w-5 h-5 sm:w-4 sm:h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="text-center text-xl md:text-lg sm:text-base flex-1 h-12 md:h-10 sm:h-9 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg"
                      disabled={updating}
                    />
                    <Button
                      onMouseDown={() => startHold('increment')}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() => startHold('increment')}
                      onTouchEnd={stopHold}
                      disabled={updating}
                      variant="outline"
                      className="w-10 h-10 sm:w-8 sm:h-8 p-0 rounded-lg bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600"
                    >
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-2">
                  <Button
                    onClick={() => handleCustomUpdate('subtract')}
                    disabled={updating || !customAmount || item.quantity === 0}
                    variant="outline"
                    className="flex-1 h-12 md:h-10 sm:h-9 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-semibold sm:text-sm transition-all"
                  >
                    <Minus className=" sm:hidden w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1" />
                    <span className="">Remove</span>
                  </Button>
                  <Button
                    onClick={() => handleCustomUpdate('add')}
                    disabled={updating || !customAmount}
                    className="flex-1 h-12 md:h-10 sm:h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold sm:text-sm transition-all"
                  >
                    <Plus className=" sm:hidden w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1" />
                    <span className="">Add</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
