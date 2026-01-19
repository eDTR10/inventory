import { useState, useCallback } from 'react';
import * as inventoryService from '../services/inventoryCrud';

export interface InventoryItem {
  id?: string;
  itemName: string;
  image?: string;
  quantity: number;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAllInventoryItems();
      setItems(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get item by name
  const getItem = useCallback(async (name: string) => {
    setError(null);
    try {
      const item = await inventoryService.getInventoryItemByName(name);
      return item;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get item';
      setError(message);
      throw err;
    }
  }, []);

  // Add item
  const addItem = useCallback(async (item: InventoryItem) => {
    setError(null);
    try {
      await inventoryService.addInventoryItem(item);
      await fetchItems(); // Refresh list
      return item;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Add multiple items
  const addItems = useCallback(async (newItems: InventoryItem[]) => {
    setError(null);
    try {
      await inventoryService.addMultipleInventoryItems(newItems);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add items';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Update item
  const updateItem = useCallback(async (itemName: string, updatedData: Partial<InventoryItem>) => {
    setError(null);
    try {
      await inventoryService.updateInventoryItem(itemName, updatedData);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Increase quantity
  const addQuantity = useCallback(async (itemName: string, amount: number = 1) => {
    setError(null);
    try {
      await inventoryService.increaseQuantity(itemName, amount);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to increase quantity';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Decrease quantity
  const removeQuantity = useCallback(async (itemName: string, amount: number = 1) => {
    setError(null);
    try {
      await inventoryService.decreaseQuantity(itemName, amount);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decrease quantity';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Delete item
  const deleteItem = useCallback(async (itemName: string) => {
    setError(null);
    try {
      await inventoryService.deleteInventoryItem(itemName);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Clear all items
  const clearAll = useCallback(async () => {
    setError(null);
    try {
      await inventoryService.clearAllInventory();
      setItems([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear inventory';
      setError(message);
      throw err;
    }
  }, []);

  // Initialize sheet
  const initSheet = useCallback(async () => {
    setError(null);
    try {
      await inventoryService.initializeSheet();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize sheet';
      setError(message);
      throw err;
    }
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    getItem,
    addItem,
    addItems,
    updateItem,
    addQuantity,
    removeQuantity,
    deleteItem,
    clearAll,
    initSheet,
  };
};

export default useInventory;
