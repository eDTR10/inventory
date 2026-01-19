import { useEffect, useRef, useState } from 'react';
import { getInventoryItemByName, increaseQuantity, decreaseQuantity } from '@/services/inventoryCrud';
import { AlertCircle, CheckCircle, Loader, Camera, X } from 'lucide-react';

export const QRCodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  
  // New states for quantity form
  const [scannedItem, setScannedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<'add' | 'deduct'>('deduct');
  const [showQuantityForm, setShowQuantityForm] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      setStatus('scanning');
      setMessage('Requesting camera access...');
      console.log('Starting camera...');
      
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      console.log('getUserMedia constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Stream obtained:', stream);
      streamRef.current = stream;

      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        
        // Wait for the video to load
        videoRef.current.onloadedmetadata = async () => {
          console.log('Video loaded metadata');
          try {
            await videoRef.current?.play();
            console.log('Video playing');
            setScanning(true);
            setMessage('Camera ready - Point at QR code');
          } catch (playError) {
            console.error('Play error:', playError);
            setMessage('Error: Could not play video stream');
            setStatus('error');
          }
        };

        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setMessage('Error: Video element failed');
          setStatus('error');
        };
        
        // Fallback timeout
        setTimeout(() => {
          console.log('Fallback timeout - checking if playing');
          if (!scanning && videoRef.current && videoRef.current.readyState >= 2) {
            console.log('Forcing scanning state');
            setScanning(true);
            setMessage('Camera ready - Point at QR code');
          }
        }, 2000);
      } else {
        console.error('videoRef.current is null');
        setMessage('Error: Video reference not available');
        setStatus('error');
      }
    } catch (error: any) {
      setStatus('error');
      let errorMessage = 'Could not access camera. ';
      
      console.error('Full error:', error);
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please enable camera in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Security error - camera access not allowed. Make sure you\'re using HTTPS or localhost.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setMessage(errorMessage);
      console.error('Camera error:', error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };

  // Process item with user-selected quantity
  const handleConfirmQuantity = async () => {
    if (!scannedItem) return;

    setStatus('processing');
    setMessage('Updating inventory...');

    try {
      if (action === 'deduct') {
        await decreaseQuantity(scannedItem, quantity);
      } else {
        await increaseQuantity(scannedItem, quantity);
      }

      // Fetch the updated item to show current quantity
      const updatedItem = await getInventoryItemByName(scannedItem);
      const currentQuantity = updatedItem?.quantity || 0;

      if (action === 'deduct') {
        setMessage(`✓ Deducted ${quantity} from ${scannedItem}\nCurrent Stock: ${currentQuantity}`);
      } else {
        setMessage(`✓ Added ${quantity} to ${scannedItem}\nCurrent Stock: ${currentQuantity}`);
      }

      setStatus('success');
      setShowQuantityForm(false);
      setScannedItem(null);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to update inventory');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-200 bg-white shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight">
          QR SCANNER
        </h1>
        <p className="text-blue-500/70 text-xs sm:text-sm mt-1 sm:mt-2">Real-time inventory tracking</p>
      </div>

      {/* Camera Preview - Full Screen */}
      <div className="flex-1 relative overflow-hidden bg-blue-50">
        {/* Always render video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: scanning ? 'block' : 'none', transform: scanning ? 'scaleX(-1)' : 'none' }}
          onPlay={() => console.log('Video onPlay triggered')}
          onLoadedMetadata={() => console.log('Video onLoadedMetadata triggered')}
          onCanPlay={() => console.log('Video onCanPlay triggered')}
          onError={(e) => console.error('Video onError:', e)}
        />

        {scanning ? (
          <>
            {/* Futuristic Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-56 sm:w-72 h-56 sm:h-72">
                {/* Outer glowing border */}
                <div className="absolute inset-0 border-2 border-blue-400/40 rounded-lg blur-sm"></div>
                {/* Main frame */}
                <div className="absolute inset-0 border-2 border-blue-500/80 rounded-lg"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-r-2 border-blue-500"></div>

                {/* Scanning line animation */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 animate-pulse" style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)',
                    animation: 'scan 2s ease-in-out infinite'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex items-center gap-2 backdrop-blur-md bg-white/80 px-3 sm:px-4 py-2 rounded-full border border-blue-300 shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-600 text-xs sm:text-sm font-medium">SCANNING</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative px-4">
            {/* Idle state */}
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 sm:p-6 rounded-2xl border border-blue-300 bg-blue-50">
                    <Camera className="w-8 sm:w-12 h-8 sm:h-12 text-blue-500" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 tracking-wide">Ready to Scan</h2>
                <p className="text-blue-600/70 text-xs sm:text-sm">Point your camera at a QR code</p>
              </div>

              <button
                onClick={startCamera}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 text-sm sm:text-base"
              >
                Activate Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls and Status - Bottom Bar */}
      <div className="relative px-4 sm:px-6 py-3 sm:py-4 border-t border-blue-200 bg-white shadow-lg space-y-3">
        {scanning && (
          <button
            onClick={stopCamera}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            Stop Scanning
          </button>
        )}

        {/* Status Messages */}
        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg flex items-start gap-3 border transition-all duration-300 text-xs sm:text-sm ${
              status === 'success'
                ? 'bg-green-50 border-green-300 text-green-700'
                : status === 'error'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-blue-50 border-blue-300 text-blue-700'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : status === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <Loader className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
            )}
            <p>{message}</p>
          </div>
        )}
      </div>

      {/* Quantity Form Modal */}
      {showQuantityForm && scannedItem && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-blue-300 rounded-lg p-6 sm:p-8 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Confirm Action</h3>
              <button
                onClick={() => {
                  setShowQuantityForm(false);
                  setScannedItem(null);
                }}
                className="text-blue-600 hover:text-blue-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Item name display */}
              <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Item:</p>
                <p className="text-blue-900 text-base sm:text-lg font-semibold mt-1">{scannedItem}</p>
              </div>

              {/* Action selection */}
              <div>
                <label className="block text-blue-700 text-sm font-semibold mb-3">Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAction('deduct')}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                      action === 'deduct'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Deduct
                  </button>
                  <button
                    onClick={() => setAction('add')}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                      action === 'add'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quantity input */}
              <div>
                <label className="block text-blue-700 text-sm font-semibold mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-blue-900 rounded-lg transition font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-2 bg-white border-2 border-blue-300 text-blue-900 rounded-lg text-center font-semibold focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-blue-900 rounded-lg transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowQuantityForm(false);
                    setScannedItem(null);
                  }}
                  className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmQuantity}
                  disabled={status === 'processing'}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {status === 'processing' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default QRCodeScanner;
