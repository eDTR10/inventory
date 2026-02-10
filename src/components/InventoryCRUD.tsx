import { useEffect, useState } from 'react';
import useInventory, { InventoryItem } from '../hooks/useInventory';
import { Button } from './ui/button';
import { Input } from './ui/input';
import QRCodeDisplay from './QRCodeDisplay';
import { QrCode, Download } from 'lucide-react';
import { getQRCodeImageUrl } from '@/services/qrCodeService';
import { jsPDF } from 'jspdf';

export const InventoryCRUD = () => {
  const {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    addQuantity,
    removeQuantity,
  } = useInventory();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    img: null as File | null,
    url: '',
    quantity: 0,
    has_sizes: false,
    size_quantities: {} as { [key: string]: number },
    location: '',
  });
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [selectedQRItem, setSelectedQRItem] = useState<{ name: string; id?: number } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newSizeName, setNewSizeName] = useState<string>('');
  const [showAddSize, setShowAddSize] = useState<boolean>(false);

  // Initialize on mount
  useEffect(() => {
    fetchItems().catch(err => console.error('Failed to fetch items:', err));
  }, [fetchItems]);

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle size quantity change
  const handleSizeQuantityChange = (size: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      size_quantities: {
        ...prev.size_quantities,
        [size]: value,
      },
    }));
  };

  // Add new size variation
  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    
    const sizeName = newSizeName.trim().toLowerCase();
    
    // Check if size already exists
    if (formData.size_quantities[sizeName] !== undefined) {
      alert('This size already exists!');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      size_quantities: {
        ...prev.size_quantities,
        [sizeName]: 0,
      },
    }));
    
    setNewSizeName('');
    setShowAddSize(false);
  };

  // Remove size variation
  const handleRemoveSize = (size: string) => {
    setFormData(prev => {
      const newSizeQuantities = { ...prev.size_quantities };
      delete newSizeQuantities[size];
      return {
        ...prev,
        size_quantities: newSizeQuantities,
      };
    });
  };

  // Toggle has_sizes
  const toggleHasSizes = () => {
    setFormData(prev => ({
      ...prev,
      has_sizes: !prev.has_sizes,
      size_quantities: !prev.has_sizes ? { small: 0, medium: 0, large: 0 } as { [key: string]: number } : {} as { [key: string]: number },
      quantity: !prev.has_sizes ? 0 : prev.quantity,
    }));
  };

  // Handle file input with compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      setFormData(prev => ({ ...prev, img: null }));
      setImagePreview(null);
      return;
    }

    try {
      // Compress and resize the image
      const compressedFile = await compressImage(file);
      
      setFormData(prev => ({
        ...prev,
        img: compressedFile,
      }));
      
      // Create preview URL from compressed file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Failed to compress image:', error);
      alert('Failed to process image. Please try a different file.');
    }
  };

  // Compress and resize image
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Maximum dimensions
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob with compression (0.8 quality = 80%)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              // Create new file from blob
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              );
              
              console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB, Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            0.8 // Quality (0-1), 0.8 = 80% quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  // Handle add/update item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (submitting) return; // Prevent duplicate submissions
    setSubmitting(true);

    try {
      if (editingItem) {
        // For update, only send changed fields
        const updateData: any = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.url) updateData.url = formData.url;
        if (formData.has_sizes !== undefined) {
          updateData.has_sizes = formData.has_sizes;
          updateData.size_quantities = formData.size_quantities;
        } else if (formData.quantity !== undefined) {
          updateData.quantity = formData.quantity;
        }
        if (formData.location !== undefined) updateData.location = formData.location;
        
        // If there's a new image file, we need to use FormData
        if (formData.img) {
          const formDataToSend = new FormData();
          Object.keys(updateData).forEach(key => {
            formDataToSend.append(key, updateData[key]);
          });
          formDataToSend.append('img', formData.img);
          await updateItem(editingItem, formDataToSend);
        } else {
          await updateItem(editingItem, updateData);
        }
        setEditingItem(null);
      } else {
        // For create, use FormData if there's an image
        const dataToSend: any = {
          name: formData.name,
          has_sizes: formData.has_sizes,
        };
        if (formData.url) dataToSend.url = formData.url;
        if (formData.location) dataToSend.location = formData.location;
        
        if (formData.has_sizes) {
          dataToSend.size_quantities = formData.size_quantities;
        } else {
          dataToSend.quantity = formData.quantity;
        }
        
        if (formData.img) {
          const formDataToSend = new FormData();
          Object.keys(dataToSend).forEach(key => {
            formDataToSend.append(key, dataToSend[key]);
          });
          formDataToSend.append('img', formData.img);
          await addItem(formDataToSend);
        } else {
          await addItem(dataToSend);
        }
      }

      setFormData({
        name: '',
        img: null,
        url: '',
        quantity: 0,
        has_sizes: false,
        size_quantities: {},
        location: '',
      });
      setImagePreview(null);
    } catch (err) {
      console.error('Failed to save item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      img: null, // Can't pre-populate file input, but show preview
      url: item.url || '',
      quantity: item.quantity,
      has_sizes: item.has_sizes || false,
      size_quantities: item.size_quantities || {},
      location: item.location || '',
    });
    setEditingItem(item.id!);
    // Set preview to existing image URL if available
    if (item.img) {
      setImagePreview(item.img);
    }
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      await deleteItem(id);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = async (id: number, operation: 'add' | 'remove') => {
    try {
      if (operation === 'add') {
        await addQuantity(id, 1);
      } else {
        await removeQuantity(id, 1);
      }
    } catch (err) {
      console.error('Failed to change quantity:', err);
    }
  };

  // Download all QR codes as a single PDF
  const downloadAllQRCodes = async () => {
    if (items.length === 0) {
      alert('No items to download');
      return;
    }

    if (isDownloading) return; // Prevent double-clicking
    setIsDownloading(true);

    try {
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const qrSize = 50; // QR code size in mm
      const qrBorderPadding = 1; // border padding in mm for easier cutting
      const cellHeight = 70;
      const cols = 3;
      const colWidth = (pageWidth - margin * 2) / cols;

      let currentPage = 1;
      let itemIndex = 0;

      // Add title
      pdf.setFontSize(16);
      pdf.text('Inventory QR Codes', margin, margin);
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, margin + 7);

      let yPosition = margin + 15;
      
      const maxYPosition = pageHeight - margin;

      // Load and add QR codes
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const col = i % cols;
        const xPosition = margin + col * colWidth;

        try {
          // Get QR code image
          const qrUrl = getQRCodeImageUrl(item.id?.toString() || item.name, 200);
          const response = await fetch(qrUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          await new Promise<void>((resolve) => {
            reader.onload = () => {
              try {
                const imgData = reader.result as string;
                // Add QR code to PDF
                const qrX = xPosition + 5;
                const qrY = yPosition;
                pdf.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);

                // Draw border around QR for cutting guide
                pdf.setDrawColor(0);
                pdf.setLineWidth(0.2);
                pdf.rect(
                  qrX - qrBorderPadding,
                  qrY - qrBorderPadding,
                  qrSize + qrBorderPadding * 2,
                  qrSize + qrBorderPadding * 2
                );

                // Add item name
                pdf.setFontSize(8);
                pdf.text(item.name, xPosition + colWidth / 2, yPosition + qrSize + 8, {
                  align: 'center',
                  maxWidth: colWidth - 10,
                });

                itemIndex++;

                // Move to next column or next row
                if ((itemIndex % cols === 0) || itemIndex === items.length) {
                  yPosition += cellHeight;

                  // Check if we need a new page
                  if (yPosition > maxYPosition && itemIndex < items.length) {
                    pdf.addPage();
                    currentPage++;
                    yPosition = margin;
                  }
                }
              } catch (error) {
                console.error(`Failed to add QR code for ${item.name}:`, error);
              }
              resolve();
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error(`Failed to load QR code for ${item.name}:`, error);
        }
      }

      // Save PDF
      pdf.save(`inventory-qr-codes-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to download QR codes:', error);
      alert('Failed to download QR codes as PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-8 lg:p-6 md:p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-2xl font-bold mb-8 md:mb-6">Inventory Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8 md:mb-6 p-6 md:p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl md:text-lg font-semibold mb-4">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h2>

        <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Item Name *</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sack Bag"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <Input
              type="file"
              name="img"
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <Input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="0"
              disabled={formData.has_sizes}
            />
          </div>

          <div className="col-span-4 lg:col-span-2 md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <input
                type="checkbox"
                checked={formData.has_sizes}
                onChange={toggleHasSizes}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>This item has size variations</span>
            </label>
          </div>

          {formData.has_sizes && (
            <div className="col-span-4 lg:col-span-2 md:col-span-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Size Quantities</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddSize(!showAddSize)}
                  className="text-xs"
                >
                  {showAddSize ? 'Cancel' : '+ Add Size'}
                </Button>
              </div>

              {showAddSize && (
                <div className="mb-3 p-3 bg-white rounded border border-blue-200">
                  <label className="block text-xs font-medium mb-1">New Size Name</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      placeholder="e.g., XXL, XS"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSize();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddSize}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {Object.keys(formData.size_quantities).map((size) => (
                  <div key={size} className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium capitalize">{size}</label>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Remove size"
                      >
                        ✕
                      </button>
                    </div>
                    <Input
                      type="number"
                      value={formData.size_quantities[size] || 0}
                      onChange={(e) => handleSizeQuantityChange(size, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                ))}
              </div>

              {Object.keys(formData.size_quantities).length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  No sizes added yet. Click "+ Add Size" to add variations.
                </p>
              )}
            </div>
          )}

          <div className="col-span-4 lg:col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Warehouse A, Shelf 3"
            />
          </div>
        </div>

        <div className="flex gap-2 md:flex-col mt-5">
          <Button type="submit" className="md:w-full" disabled={submitting}>
            {submitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                {editingItem ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingItem ? 'Update Item' : 'Add Item'
            )}
          </Button>
          {editingItem && (
            <Button
              type="button"
              variant="outline"
              className="md:w-full"
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  name: '',
                  img: null,
                  url: '',
                  quantity: 0,
                  has_sizes: false,
                  size_quantities: {},
                  location: '',
                });
                setImagePreview(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div>
        <div className="flex items-center justify-between md:flex-col md:gap-3 mb-4">
          <h2 className="text-xl md:text-lg font-semibold">
            Inventory Items ({items.length})
          </h2>
          {items.length > 0 && (
            <Button
              onClick={downloadAllQRCodes}
              disabled={isDownloading}
              className="gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:w-full"
            >
              {isDownloading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download All QR Codes (PDF)
                </>
              )}
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No items in inventory</p>
        ) : (
          <div className="overflow-x-auto md:-mx-4">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 md:p-2 text-left text-sm md:text-xs">Item Name</th>
                    <th className="border p-3 md:p-2 text-left text-sm md:text-xs">Image</th>
                    <th className="border p-3 md:p-2 text-left text-sm md:text-xs slg:hidden">URL</th>
                    <th className="border p-3 md:p-2 text-left text-sm md:text-xs slg:hidden">Location</th>
                    <th className="border p-3 md:p-2 text-right text-sm md:text-xs">Quantity</th>
                    <th className="border p-3 md:p-2 text-center text-sm md:text-xs lg:hidden">QR Code</th>
                    <th className="border p-3 md:p-2 text-center text-sm md:text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border hover:bg-gray-50">
                      <td className="border p-3 md:p-2 font-medium text-sm md:text-xs">{item.name}</td>
                      <td className="border p-3 md:p-2">
                        {item.img ? (
                          <div className="flex justify-center">
                            <img 
                              src={item.img} 
                              alt={item.name}
                              className="w-[150px] h-[150px] object-contain rounded border"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center w-[150px] h-[150px]">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="border p-3 md:p-2 slg:hidden">
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm md:text-xs">
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm md:text-xs">-</span>
                        )}
                      </td>
                      <td className="border p-3 md:p-2 slg:hidden">
                        <span className="text-sm md:text-xs">{item.location || '-'}</span>
                      </td>
                      <td className="border p-3 md:p-2 text-right">
                        {item.has_sizes && item.size_quantities ? (
                          <div className="text-sm md:text-xs">
                            <div className="font-semibold mb-1">Total: {item.quantity}</div>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              {Object.entries(item.size_quantities).map(([size, qty]) => (
                                <div key={size} className="capitalize">
                                  {size}: {qty}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2 md:gap-1">
                            <button
                              onClick={() => handleQuantityChange(item.id!, 'remove')}
                              className="px-2 py-1 md:px-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm md:text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 md:w-6 text-center font-semibold text-sm md:text-xs">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id!, 'add')}
                              className="px-2 py-1 md:px-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm md:text-xs"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="border p-3 md:p-2 text-center lg:hidden">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQRItem({ name: item.name, id: item.id })}
                          className="gap-2 text-xs"
                        >
                          <QrCode className="w-4 h-4 md:w-3 md:h-3" />
                          <span className="slg:hidden">Show QR</span>
                          <span className="hidden slg:inline">QR</span>
                        </Button>
                      </td>
                      <td className="border p-3 md:p-2 text-center">
                        <div className="flex gap-2 md:gap-1 justify-center lg:flex-col">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="text-xs lg:w-full"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id!, item.name)}
                            className="text-red-600 hover:text-red-700 text-xs lg:w-full"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Display Modal */}
      {selectedQRItem && (
        <QRCodeDisplay
          itemName={selectedQRItem.name}
          itemId={selectedQRItem.id}
          onClose={() => setSelectedQRItem(null)}
        />
      )}
    </div>
  );
};

export default InventoryCRUD;
