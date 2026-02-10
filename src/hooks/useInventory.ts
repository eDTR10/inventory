import { useState, useCallback } from 'react';
import axios from '../plugin/axios';

export interface InventoryItem {
  id?: number;
  name: string;
  img?: string;
  url?: string;
  quantity: number;
  has_sizes?: boolean;
  size_quantities?: { [key: string]: number };  // e.g., { "small": 10, "medium": 15, "large": 5 }
  location?: string;
  date_created?: string;
  date_updated?: string;
}

export interface InventoryLog {
  id: number;
  user: number;
  user_email: string;
  action: 'create' | 'update' | 'delete';
  item: number;
  item_name: string;
  quantity: number;
  date_created: string;
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
      const response = await axios.get<InventoryItem[]>('inventory/items/');
      setItems(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get item by id
  const getItem = useCallback(async (id: number) => {
    setError(null);
    try {
      const response = await axios.get<InventoryItem>(`inventory/items/${id}/`);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get item';
      setError(message);
      throw err;
    }
  }, []);

  // Add item
  const addItem = useCallback(async (item: Omit<InventoryItem, 'id' | 'date_created' | 'date_updated'> | FormData) => {
    setError(null);
    try {
      const config = item instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      const response = await axios.post<InventoryItem>('inventory/items/', item, config);
      await fetchItems(); // Refresh list
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Update item
  const updateItem = useCallback(async (id: number, updatedData: Partial<InventoryItem> | FormData) => {
    setError(null);
    try {
      const config = updatedData instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      await axios.patch<InventoryItem>(`inventory/items/${id}/`, updatedData, config);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Increase quantity
  const addQuantity = useCallback(async (id: number, amount: number = 1) => {
    setError(null);
    try {
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('Item not found');
      await axios.patch<InventoryItem>(`inventory/items/${id}/`, {
        quantity: item.quantity + amount
      });
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to increase quantity';
      setError(message);
      throw err;
    }
  }, [fetchItems, items]);

  // Decrease quantity
  const removeQuantity = useCallback(async (id: number, amount: number = 1) => {
    setError(null);
    try {
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('Item not found');
      const newQuantity = Math.max(0, item.quantity - amount);
      await axios.patch<InventoryItem>(`inventory/items/${id}/`, {
        quantity: newQuantity
      });
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decrease quantity';
      setError(message);
      throw err;
    }
  }, [fetchItems, items]);

  // Delete item
  const deleteItem = useCallback(async (id: number) => {
    setError(null);
    try {
      await axios.delete(`inventory/items/${id}/`);
      await fetchItems(); // Refresh list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  // Get logs for an item
  const getItemLogs = useCallback(async (id: number) => {
    setError(null);
    try {
      const response = await axios.get<InventoryLog[]>(`inventory/items/${id}/logs/`);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get logs';
      setError(message);
      throw err;
    }
  }, []);

  // Get all logs with optional filters
  const getLogs = useCallback(async (filters?: { item_id?: number; user_id?: number; action?: string }) => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.item_id) params.append('item_id', filters.item_id.toString());
      if (filters?.user_id) params.append('user_id', filters.user_id.toString());
      if (filters?.action) params.append('action', filters.action);
      
      const response = await axios.get<InventoryLog[]>(`inventory/logs/?${params.toString()}`);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get logs';
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
    updateItem,
    addQuantity,
    removeQuantity,
    deleteItem,
    getItemLogs,
    getLogs,
  };
};

export default useInventory;
