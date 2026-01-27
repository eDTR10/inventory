/**
 * QR Code Service
 * Handles QR code generation and scanning data
 */

/**
 * Generate QR code data as a link URL
 * Returns a link to access the item page
 */
export const generateQRCodeData = (itemName: string): string => {
  // Get the base URL from current location
  const baseUrl = window.location.origin;
  // Return a link to the item page with the item name as a parameter
  return `${baseUrl}/inventory/item/${encodeURIComponent(itemName)}`;
};

/**
 * Parse QR code data - extract item name from URL
 */
export const parseQRCodeData = (qrString: string): string | null => {
  try {
    const trimmed = qrString.trim();
    if (trimmed && trimmed.length > 0) {
      // Try to extract item name from URL
      const url = new URL(trimmed);
      const pathMatch = url.pathname.match(/\/item\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]);
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
 * Includes margin parameter for white space around the QR code
 */
export const getQRCodeImageUrl = (itemName: string, size: number = 200): string => {
  const data = generateQRCodeData(itemName);
  const encoded = encodeURIComponent(data);
  // margin parameter adds white space border (15 = generous padding)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=15`;
};

export default {
  generateQRCodeData,
  parseQRCodeData,
  getQRCodeImageUrl,
};
