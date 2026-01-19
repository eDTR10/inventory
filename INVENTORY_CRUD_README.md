# Inventory CRUD System - Google Sheets API

A complete CRUD (Create, Read, Update, Delete) inventory management system using Google Sheets API v4.

## Files Created

1. **[src/plugin/axios.tsx](src/plugin/axios.tsx)** - Updated with Google OAuth2 authentication
2. **[src/services/inventoryCrud.ts](src/services/inventoryCrud.ts)** - Core CRUD service
3. **[src/hooks/useInventory.ts](src/hooks/useInventory.ts)** - React hook for inventory operations
4. **[src/components/InventoryCRUD.tsx](src/components/InventoryCRUD.tsx)** - Example UI component

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=763700596615-10q8fvp0q6rfkcugvv3n1oi4hj7n169j.apps.googleusercontent.com
```

### 2. Sheet Structure

The system expects the following columns in your Google Sheet:
- **A**: Name (string)
- **B**: Quantity (number)
- **C**: Price (number)
- **D**: Category (string)
- **E**: Description (string)
- **F**: Date Added (ISO string)
- **G**: Last Updated (ISO string)

**Sheet ID:** `1OErW9xPXiyVjg2gnO0kOn-fyg3A5bg7gW0-2b7GZHD8`
**Tab Name:** `2026-01-14`

### 3. Google Sheets API Permissions

Make sure you have the `https://www.googleapis.com/auth/spreadsheets` scope enabled in your Google OAuth configuration.

## Usage

### Using the Hook in Components

```typescript
import { InventoryCRUD } from '@/components/InventoryCRUD';

function App() {
  return <InventoryCRUD />;
}
```

### Using the Service Directly

```typescript
import * as inventoryService from '@/services/inventoryCrud';

// Fetch all items
const items = await inventoryService.getAllInventoryItems();

// Add new item
await inventoryService.addInventoryItem({
  name: 'Apple',
  quantity: 50,
  price: 0.99,
  category: 'Fruits',
  description: 'Fresh red apples',
});

// Update item
await inventoryService.updateInventoryItem('Apple', {
  quantity: 45,
  price: 1.09,
});

// Increase/Decrease quantity
await inventoryService.increaseQuantity('Apple', 10);
await inventoryService.decreaseQuantity('Apple', 5);

// Delete item
await inventoryService.deleteInventoryItem('Apple');

// Clear all items
await inventoryService.clearAllInventory();
```

### Using the Custom Hook

```typescript
import useInventory from '@/hooks/useInventory';

function MyComponent() {
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

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => addQuantity(item.name, 1)}>+</button>
          <button onClick={() => removeQuantity(item.name, 1)}>-</button>
          <button onClick={() => deleteItem(item.name)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### Service Methods

#### Read Operations

- `getAllInventoryItems()` - Fetch all items from the sheet
- `getInventoryItemByName(name)` - Get a specific item by name

#### Create Operations

- `addInventoryItem(item)` - Add a single item
- `addMultipleInventoryItems(items)` - Add multiple items at once

#### Update Operations

- `updateInventoryItem(itemName, updatedData)` - Update item properties
- `increaseQuantity(itemName, amount)` - Increase item quantity
- `decreaseQuantity(itemName, amount)` - Decrease item quantity

#### Delete Operations

- `deleteInventoryItem(itemName)` - Delete a specific item
- `clearAllInventory()` - Delete all items

#### Utility

- `initializeSheet()` - Initialize sheet with headers if empty

## Authentication Flow

1. The axios interceptor automatically includes the Google access token from `localStorage`
2. Token is stored when user authenticates via `loginWithGoogle()`
3. All API calls include `Authorization: Bearer <token>` header

## Error Handling

All methods include error handling. Use try-catch:

```typescript
try {
  const items = await getAllInventoryItems();
} catch (error) {
  console.error('Failed to fetch items:', error);
}
```

The custom hook provides an `error` state:

```typescript
const { error, items } = useInventory();

if (error) {
  return <div className="text-red-600">Error: {error}</div>;
}
```

## Sheet Data Format

### Headers (Row 1)
| Name | Quantity | Price | Category | Description | Date Added | Last Updated |
|------|----------|-------|----------|-------------|------------|--------------|

### Example Data (Row 2+)
| Apple | 50 | 0.99 | Fruits | Fresh red apples | 2026-01-14T10:30:00Z | 2026-01-14T15:45:00Z |

## Features

✅ **Full CRUD Operations** - Create, read, update, delete items
✅ **Batch Operations** - Add multiple items at once
✅ **Quantity Management** - Increase/decrease without full updates
✅ **Error Handling** - Comprehensive error messages
✅ **TypeScript** - Full type safety
✅ **React Hooks** - Easy integration with React components
✅ **Google OAuth2** - Secure authentication
✅ **Real-time Updates** - Automatic data refresh after operations

## Tips

1. Always call `initializeSheet()` before first use to ensure headers exist
2. Use `addQuantity()` and `removeQuantity()` for fast quantity updates
3. Item names are case-insensitive for lookups
4. Always authenticate before attempting any operations
5. The sheet will auto-populate timestamps for `dateAdded` and `lastUpdated`

## Troubleshooting

**"Google API not loaded" error**
- Make sure `initializeGoogleAuth()` was called in your app's initialization

**"Item not found" error**
- Verify the exact item name (case-insensitive but must match)

**401 Unauthorized**
- Ensure user is authenticated with `loginWithGoogle()`
- Check that access token hasn't expired

**Sheet not updating**
- Verify sheet ID and tab name are correct
- Ensure authenticated user has edit permissions on the sheet

## Google OAuth Scope

The system uses the `https://www.googleapis.com/auth/spreadsheets` scope which allows:
- Read/write access to spreadsheets
- Create/delete/update rows and values
- Modify sheet structure

This is more permissive than `.readonly` and is required for full CRUD operations.
