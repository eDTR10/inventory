# User Authentication & Logout Updates

## Changes Made

### 1. Updated Auth Context ([src/context/AuthContext.tsx](src/context/AuthContext.tsx))
- Added `userEmail` state to track logged-in user's email
- Updated logout function to clear both `google_access_token` and `user_email` from localStorage
- Exposed `userEmail` in AuthContext for components to access

### 2. Updated Logs Service ([src/services/logsService.ts](src/services/logsService.ts))
- Improved `getCurrentUser()` to properly read user email from localStorage
- Now displays actual user email in logs instead of "Unknown User"

### 3. Created User Profile Component ([src/components/UserProfile.tsx](src/components/UserProfile.tsx))
- Displays logged-in user's email in top-right corner
- Shows "Logged in as" label with user email
- Logout button with confirmation dialog
- Only visible when user is authenticated
- Includes note about audit logging

### 4. Updated App.tsx ([src/App.tsx](src/App.tsx))
- Added UserProfile component to display at app level
- Positioned in top-right corner above all content

## How It Works

### Before Login
- User sees "Access Required" screen
- Clicks "Sign In with Google"

### After Login
- User profile box appears in top-right corner showing:
  - Email address of logged-in user
  - Logout button
  - Audit logging notice

### Logs Table Now Shows
- **user**: `user@example.com` (actual email instead of "Unknown User")
- **action**: CREATE, UPDATE, DELETE, etc.
- **date_time**: ISO timestamp
- **changes**: Detailed description of changes

### Example Log Entry
```
user: john@example.com
action: UPDATE
date_time: 2026-01-19T05:33:28.741Z
changes: Updated item: nico. Changes: quantity: 12 → 13
```

### Logout Flow
1. Click logout button in user profile box
2. Confirmation dialog appears
3. User confirms logout
4. Tokens cleared from localStorage
5. User returned to login screen
6. Next page reload completes logout

## Features
✅ User email captured during OAuth login
✅ Email displayed in profile component
✅ Email stored in localStorage for logging
✅ Logout clears all authentication data
✅ User email appears in all audit logs
✅ No more "Unknown User" entries
