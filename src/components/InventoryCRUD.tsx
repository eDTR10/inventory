import { useEffect, useState } from 'react';
import useInventory, { InventoryItem } from '../hooks/useInventory';
import { Button } from './ui/button';
import { Input } from './ui/input';
import QRCodeDisplay from './QRCodeDisplay';
import { QrCode } from 'lucide-react';

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
        <h2 className="text-xl font-semibold mb-4">
          Inventory Items ({items.length})
        </h2>

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
