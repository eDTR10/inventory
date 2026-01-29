import { useState } from 'react';
import { getQRCodeImageUrl } from '@/services/qrCodeService';
import { Button } from './ui/button';
import { Download, X, ExternalLink } from 'lucide-react';

interface QRCodeDisplayProps {
  itemName: string;
  itemId?: number;
  onClose?: () => void;
}

export const QRCodeDisplay = ({ itemName, itemId, onClose }: QRCodeDisplayProps) => {
  const [size, setSize] = useState(300);
  const itemLink = `${import.meta.env.VITE_URL}/inventory/item/${itemId || encodeURIComponent(itemName)}`;
  const qrUrl = getQRCodeImageUrl(itemId?.toString() || itemName, size);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const img = new Image();
      img.onload = () => {
        // Create canvas with extra space for text
        const canvas = document.createElement('canvas');
        const padding = 30;
        const textHeight = 60;
        const canvasWidth = img.width + (padding * 2);
        const canvasHeight = img.height + (padding * 2) + textHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set white background
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw QR code image
        ctx.drawImage(img, padding, padding);

        // Add item name text below QR code
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${itemName}`, canvasWidth / 2, img.height + padding + 45);

        // Download the canvas
        canvas.toBlob((canvasBlob) => {
          if (canvasBlob) {
            const url = window.URL.createObjectURL(canvasBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${itemName}-qrcode.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        });
      };
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleOpenLink = () => {
    window.open(itemLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">QR Code Link</h2>
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

          {/* Link Info */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-slate-800 rounded border border-blue-200 dark:border-blue-700">
            <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Link:</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 break-all font-mono">{itemLink}</p>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 p-3 rounded mb-4">
            📱 Scan this QR code to open the item page where users can add or deduct quantities from their mobile device!
          </p>
        </div>

        <div className="flex gap-2 flex-col">
          <Button onClick={handleDownload} className="w-full" variant="default">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          <Button onClick={handleOpenLink} variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Item Link
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
