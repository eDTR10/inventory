/**
 * Local QR Code Decoder
 * Decodes QR codes from images using Canvas API
 * This is a simple decoder for basic QR code detection
 */

export const decodeQRFromImage = async (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = async () => {
        try {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Try to detect QR code patterns
          // This is a simplified detection - look for dark squares
          const qrText = await detectQRPattern();
          
          if (qrText) {
            resolve(qrText);
          } else {
            // If detection fails, try loading jsQR library dynamically
            const qrText = await decodeWithJsQR(imageData, canvas.width, canvas.height);
            resolve(qrText);
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
};

// Simple QR pattern detection (fallback method)
const detectQRPattern = async (): Promise<string | null> => {
  // This is a placeholder - in real scenario, you'd use jsQR library
  // For now, we'll return null to trigger jsQR loading
  return null;
};

// Use jsQR library for actual decoding
const decodeWithJsQR = async (imageData: ImageData, width: number, height: number): Promise<string | null> => {
  try {
    // Dynamically load jsQR library from CDN
    const jsQR = (await import('jsqr')).default;
    
    const code = jsQR(imageData.data, width, height);
    
    if (code) {
      console.log('QR Code decoded:', code.data);
      return code.data;
    }
    
    return null;
  } catch (error) {
    console.error('jsQR loading or decoding error:', error);
    return null;
  }
};

// Decode QR from canvas/video frame
export const decodeQRFromCanvas = async (canvas: HTMLCanvasElement): Promise<string | null> => {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Try jsQR decoding
    const jsQR = (await import('jsqr')).default;
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    
    if (code) {
      console.log('QR Code detected:', code.data);
      return code.data;
    }
    
    return null;
  } catch (error) {
    console.error('Canvas decode error:', error);
    return null;
  }
};
