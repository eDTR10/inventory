import { useState } from 'react';
import { getQRCodeImageUrl } from '@/services/qrCodeService';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

interface QRCodeDisplayProps {
  itemName: string;
  onClose?: () => void;
}

export const QRCodeDisplay = ({ itemName, onClose }: QRCodeDisplayProps) => {
  const [size, setSize] = useState(300);
  const qrUrl = getQRCodeImageUrl(itemName, size);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${itemName}-qrcode.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">QR Code</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Item: <span className="font-semibold text-gray-900 dark:text-white">{itemName}</span>
          </p>

          <div className="bg-white p-4 rounded border border-gray-200 flex items-center justify-center mb-4">
            <img
              src={qrUrl}
              alt={`QR Code for ${itemName}`}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Size (px)</label>
            <input
              type="range"
              min="150"
              max="500"
              step="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{size}x{size}px</p>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 p-3 rounded mb-4">
            📱 Scan this QR code to quickly adjust inventory quantities. Perfect for warehouse operations!
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1" variant="default">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
