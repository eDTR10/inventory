/**
 * QR Code Service
 * Handles QR code generation and scanning data
 */

/**
 * Generate QR code data for an item
 * Returns JSON format with item name
 */
export const generateQRCodeData = (itemName: string): string => {
  // Return JSON format with item name
  return JSON.stringify({ itemName });
};

/**
 * Parse QR code data - extract item name from JSON
 */
export const parseQRCodeData = (qrString: string): string | null => {
  try {
    const trimmed = qrString.trim();
    if (trimmed && trimmed.length > 0) {
      const data = JSON.parse(trimmed);
      if (data.itemName && typeof data.itemName === 'string') {
        return data.itemName;
      }
    }
  } catch (error) {
    console.error('Invalid QR code data:', error);
  }
  return null;
};

/**
 * Generate QR code URL using a free QR code API
 * (qr-server.com is a free service)
 */
export const getQRCodeImageUrl = (itemName: string, size: number = 200): string => {
  const data = generateQRCodeData(itemName);
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
};

export default {
  generateQRCodeData,
  parseQRCodeData,
  getQRCodeImageUrl,
};
