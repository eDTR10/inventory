import { useEffect, useState } from 'react';
import useInventory, { InventoryItem } from '../hooks/useInventory';
import { Button } from './ui/button';
import { Input } from './ui/input';
import QRCodeDisplay from './QRCodeDisplay';
import { QrCode, Download } from 'lucide-react';
import { getQRCodeImageUrl } from '@/services/qrCodeService';

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
    initSheet,
  } = useInventory();

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    image: '',
    quantity: 0,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedQRItem, setSelectedQRItem] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initSheet();
        await fetchItems();
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    };
    initialize();
  }, []);

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle add/update item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    try {
      if (editingItem) {
        await updateItem(editingItem, formData);
        setEditingItem(null);
      } else {
        await addItem(formData as InventoryItem);
      }

      setFormData({
        itemName: '',
        image: '',
        quantity: 0,
      });
    } catch (err) {
      console.error('Failed to save item:', err);
    }
  };

  // Handle edit
  const handleEdit = (item: InventoryItem) => {
    setFormData({
      itemName: item.itemName,
      image: item.image || '',
      quantity: item.quantity,
    });
    setEditingItem(item.itemName);
  };

  // Handle delete
  const handleDelete = async (itemName: string) => {
    if (!window.confirm(`Delete "${itemName}"?`)) return;

    try {
      await deleteItem(itemName);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = async (itemName: string, operation: 'add' | 'remove') => {
    try {
      if (operation === 'add') {
        await addQuantity(itemName, 1);
      } else {
        await removeQuantity(itemName, 1);
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
      // Load jsPDF dynamically
      const jsPDF = (await import('jspdf')).jsPDF;
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
      const cellHeight = 70;
      const cols = 3;
      const colWidth = (pageWidth - margin * 2) / cols;
      const usableWidth = pageWidth - margin * 2;

      let currentPage = 1;
      let itemIndex = 0;

      // Add title
      pdf.setFontSize(16);
      pdf.text('Inventory QR Codes', margin, margin);
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, margin + 7);

      let yPosition = margin + 15;
      const pageStartY = yPosition;
      const maxYPosition = pageHeight - margin;

      // Load and add QR codes
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const col = i % cols;
        const xPosition = margin + col * colWidth;

        try {
          // Get QR code image
          const qrUrl = getQRCodeImageUrl(item.itemName, 200);
          const response = await fetch(qrUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          await new Promise<void>((resolve) => {
            reader.onload = () => {
              try {
                const imgData = reader.result as string;
                // Add QR code to PDF
                pdf.addImage(imgData, 'PNG', xPosition + 5, yPosition, qrSize, qrSize);

                // Add item name
                pdf.setFontSize(8);
                pdf.text(item.itemName, xPosition + colWidth / 2, yPosition + qrSize + 8, {
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
                console.error(`Failed to add QR code for ${item.itemName}:`, error);
              }
              resolve();
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error(`Failed to load QR code for ${item.itemName}:`, error);
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
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Item Name *</label>
            <Input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="e.g., Sack Bag"
              disabled={!!editingItem}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
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
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {editingItem ? 'Update Item' : 'Add Item'}
          </Button>
          {editingItem && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  itemName: '',
                  image: '',
                  quantity: 0,
                });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Inventory Items ({items.length})
          </h2>
          {items.length > 0 && (
            <Button
              onClick={downloadAllQRCodes}
              disabled={isDownloading}
              className="gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Item Name</th>
                  <th className="border p-3 text-left">Image</th>
                  <th className="border p-3 text-right">Quantity</th>
                  <th className="border p-3 text-center">QR Code</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border hover:bg-gray-50">
                    <td className="border p-3 font-medium">{item.itemName}</td>
                    <td className="border p-3">
                      {item.image ? (
                        <a href={item.image} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          View Image
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="border p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.itemName, 'remove')}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.itemName, 'add')}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="border p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedQRItem(item.itemName)}
                        className="gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        Show QR
                      </Button>
                    </td>
                    <td className="border p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.itemName)}
                          className="text-red-600 hover:text-red-700"
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
        )}
      </div>

      {/* QR Code Display Modal */}
      {selectedQRItem && (
        <QRCodeDisplay
          itemName={selectedQRItem}
          onClose={() => setSelectedQRItem(null)}
        />
      )}
    </div>
  );
};

export default InventoryCRUD;
