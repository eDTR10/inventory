import axios from '../plugin/axios';
import { addLog, initializeLogsSheet } from './logsService';

// Configuration - Load from environment variables
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '';
const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || '2026-01-14';

// Validate required environment variables
if (!SHEET_ID) {
  console.warn('⚠️ WARNING: VITE_GOOGLE_SHEET_ID is not set! Add it to .env.local');
}

interface InventoryItem {
  id?: string;
  itemName: string;
  image?: string;
  quantity: number;
}

interface SheetData {
  values: string[][];
  range: string;
}

// Helper to convert row data to InventoryItem
const rowToItem = (row: string[], index: number): InventoryItem => {
  return {
    id: String(index),
    itemName: row[0] || '',
    image: row[1] || '',
    quantity: parseInt(row[2]) || 0,
  };
};

// Helper to convert InventoryItem to row data
const itemToRow = (item: InventoryItem): string[] => {
  return [
    item.itemName,
    item.image || '',
    String(item.quantity),
  ];
};

/**
 * READ - Get all inventory items from the sheet
 */
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const response = await axios.get<SheetData>(
      `${SHEET_ID}/values/${SHEET_NAME}?valueRenderOption=FORMATTED_VALUE`
    );

    const data = response.data.values;
    if (!data || data.length <= 1) {
      console.log('No inventory data found');
      return [];
    }

    // Skip header row and convert to InventoryItem[]
    const items = data.slice(1).map((row, index) => rowToItem(row, index + 1));
    console.log('✓ Fetched', items.length, 'inventory items');
    return items;
  } catch (error) {
    console.error('✗ Error fetching inventory items:', error);
    throw error;
  }
};

/**
 * READ - Get a single item by name
 */
export const getInventoryItemByName = async (name: string): Promise<InventoryItem | null> => {
  try {
    const items = await getAllInventoryItems();
    const item = items.find(i => i.itemName.toLowerCase() === name.toLowerCase());
    return item || null;
  } catch (error) {
    console.error('✗ Error fetching item by name:', error);
    throw error;
  }
};

/**
 * CREATE - Add a new inventory item
 */
export const addInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  try {
    const row = itemToRow(item);
    
    await axios.post(
      `${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW`,
      {
        values: [row],
      }
    );

    console.log('✓ Item added successfully:', item.itemName);
    
    // Log the action
    await addLog(
      'CREATE',
      `Added item: ${item.itemName}, Quantity: ${item.quantity}${item.image ? `, Image: ${item.image}` : ''}`
    );
    
    return item;
  } catch (error) {
    console.error('✗ Error adding inventory item:', error);
    throw error;
  }
};

/**
 * CREATE - Add multiple inventory items
 */
export const addMultipleInventoryItems = async (items: InventoryItem[]): Promise<void> => {
  try {
    const rows = items.map(item => itemToRow(item));
    
    await axios.post(
      `${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW`,
      {
        values: rows,
      }
    );

    console.log('✓ Added', items.length, 'items successfully');
    
    // Log the action
    const itemNames = items.map(i => i.itemName).join(', ');
    await addLog('CREATE_BATCH', `Added ${items.length} items: ${itemNames}`);
  } catch (error) {
    console.error('✗ Error adding multiple items:', error);
    throw error;
  }
};

/**
 * UPDATE - Update an existing inventory item by name
 */
export const updateInventoryItem = async (
  itemName: string,
  updatedData: Partial<InventoryItem>
): Promise<void> => {
  try {
    const items = await getAllInventoryItems();
    const itemIndex = items.findIndex(i => i.itemName.toLowerCase() === itemName.toLowerCase());

    if (itemIndex === -1) {
      throw new Error(`Item "${itemName}" not found`);
    }

    // Update the item (row index + 2 because of header and 0-based indexing)
    const rowIndex = itemIndex + 2;
    const oldItem = items[itemIndex];
    const updatedItem = { ...oldItem, ...updatedData };
    const row = itemToRow(updatedItem);

    const range = `${SHEET_NAME}!A${rowIndex}:C${rowIndex}`;
    
    await axios.put(
      `${SHEET_ID}/values/${range}?valueInputOption=RAW`,
      {
        values: [row],
      }
    );

    console.log('✓ Item updated successfully:', itemName);
    
    // Log the action with changes
    const changes = Object.entries(updatedData)
      .map(([key, value]) => `${key}: ${oldItem[key as keyof InventoryItem]} → ${value}`)
      .join(', ');
    await addLog('UPDATE', `Updated item: ${itemName}. Changes: ${changes}`);
  } catch (error) {
    console.error('✗ Error updating inventory item:', error);
    throw error;
  }
};

/**
 * UPDATE - Increase quantity of an item
 */
export const increaseQuantity = async (itemName: string, amount: number = 1): Promise<void> => {
  try {
    const item = await getInventoryItemByName(itemName);
    if (!item) {
      throw new Error(`Item "${itemName}" not found`);
    }

    await updateInventoryItem(itemName, {
      quantity: item.quantity + amount,
    });

    console.log(`✓ Quantity increased for "${itemName}" by ${amount}`);
  } catch (error) {
    console.error('✗ Error increasing quantity:', error);
    throw error;
  }
};

/**
 * UPDATE - Decrease quantity of an item
 */
export const decreaseQuantity = async (itemName: string, amount: number = 1): Promise<void> => {
  try {
    const item = await getInventoryItemByName(itemName);
    if (!item) {
      throw new Error(`Item "${itemName}" not found`);
    }

    const newQuantity = Math.max(0, item.quantity - amount);
    await updateInventoryItem(itemName, {
      quantity: newQuantity,
    });

    console.log(`✓ Quantity decreased for "${itemName}" by ${amount}`);
  } catch (error) {
    console.error('✗ Error decreasing quantity:', error);
    throw error;
  }
};

/**
 * DELETE - Remove an inventory item by name
 */
export const deleteInventoryItem = async (itemName: string): Promise<void> => {
  try {
    const items = await getAllInventoryItems();
    const itemIndex = items.findIndex(i => i.itemName.toLowerCase() === itemName.toLowerCase());

    if (itemIndex === -1) {
      throw new Error(`Item "${itemName}" not found`);
    }

    const deletedItem = items[itemIndex];

    // Row index to delete (itemIndex + 2 because of header and 1-based indexing)
    const rowIndex = itemIndex + 2;

    await axios.post(
      `${SHEET_ID}/batchUpdate`,
      {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // First sheet
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-based
                endIndex: rowIndex, // Exclusive
              },
            },
          },
        ],
      }
    );

    console.log('✓ Item deleted successfully:', itemName);
    
    // Log the action
    await addLog(
      'DELETE',
      `Deleted item: ${itemName}, Quantity: ${deletedItem.quantity}${deletedItem.image ? `, Image: ${deletedItem.image}` : ''}`
    );
  } catch (error) {
    console.error('✗ Error deleting inventory item:', error);
    throw error;
  }
};

/**
 * DELETE - Clear all inventory items (removes all data rows, keeps header)
 */
export const clearAllInventory = async (): Promise<void> => {
  try {
    const items = await getAllInventoryItems();
    if (items.length === 0) {
      console.log('Inventory is already empty');
      return;
    }

    // Delete all rows except header (rows 2 through end)
    await axios.post(
      `${SHEET_ID}/batchUpdate`,
      {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: 1, // Keep header (row 1)
                endIndex: items.length + 1,
              },
            },
          },
        ],
      }
    );

    console.log('✓ All inventory items cleared');
  } catch (error) {
    console.error('✗ Error clearing inventory:', error);
    throw error;
  }
};

/**
 * Initialize sheet with headers if empty
 */
export const initializeSheet = async (): Promise<void> => {
  try {
    const response = await axios.get<SheetData>(
      `${SHEET_ID}/values/${SHEET_NAME}`
    );

    const hasData = response.data.values && response.data.values.length > 0;

    if (!hasData) {
      const headers = [
        ['Item Name', 'Image', 'Quantity'],
      ];

      await axios.put(
        `${SHEET_ID}/values/${SHEET_NAME}?valueInputOption=RAW`,
        {
          values: headers,
        }
      );

      console.log('✓ Sheet initialized with headers');
    }

    // Also initialize logs sheet
    await initializeLogsSheet();
  } catch (error) {
    console.error('✗ Error initializing sheet:', error);
    throw error;
  }
};

export default {
  getAllInventoryItems,
  getInventoryItemByName,
  addInventoryItem,
  addMultipleInventoryItems,
  updateInventoryItem,
  increaseQuantity,
  decreaseQuantity,
  deleteInventoryItem,
  clearAllInventory,
  initializeSheet,
};
