# Deployment Guide - Inventory Tracker

## Prerequisites

Before deploying, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- A Google Cloud Project with APIs enabled
- Access to a Google Sheet for inventory data

## Step 1: Set Up Environment Variables

### 1.1 Create `.env.local` file in the root directory

```bash
# Copy the example file
cp .env.example .env.local
```

### 1.2 Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3001` (for local development)
   - `https://yourdomain.com` (for production)
7. Copy the **Client ID** and add to `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

### 1.3 Configure Google Sheets

1. Create a Google Sheet for your inventory
2. The sheet should have columns: `itemName`, `image`, `quantity`
3. Create another sheet named `logs` for audit trail
4. Share the sheet with your Google OAuth service account (or it will work with your personal account)
5. Get the Sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
6. Add to `.env.local`:

```env
VITE_GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
VITE_GOOGLE_SHEET_NAME=2026-01-14
VITE_GOOGLE_LOGS_SHEET_NAME=logs
```

### 1.4 Complete `.env.local` Example

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=763700596615-10q8fvp0q6rfkcugvv3n1oi4hj7n169j.apps.googleusercontent.com

# Google Sheets Configuration
VITE_GOOGLE_SHEET_ID=1OErW9xPXiyVjg2gnO0kOn-fyg3A5bg7gW0-2b7GZHD8
VITE_GOOGLE_SHEET_NAME=2026-01-14
VITE_GOOGLE_LOGS_SHEET_NAME=logs

# Application Environment
VITE_API_BASE_URL=https://sheets.googleapis.com/v4/spreadsheets/
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Enable Required Google APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Library**
3. Search for and enable these APIs:
   - **Google Sheets API**
   - **Google Drive API** (optional, for future integrations)

## Step 4: Set Up OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth Consent Screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: "Inventory Tracker"
   - User support email: Your email
   - Developer contact: Your email
4. Add required scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
5. Add test users (yourself) if in development

## Step 5: Build for Production

```bash
npm run build
```

This will create a `dist/` folder with optimized production files.

## Step 6: Deploy

### Option A: Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_SHEET_ID`
   - `VITE_GOOGLE_SHEET_NAME`
   - `VITE_GOOGLE_LOGS_SHEET_NAME`

### Option B: Deploy to Netlify

```bash
npm run build
# Then drag and drop the dist folder to Netlify
```

Or connect GitHub:
1. Push to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify Site Settings

### Option C: Deploy to Your Own Server

```bash
# Build the project
npm run build

# Upload the dist folder to your server
# For example, using SCP:
scp -r dist/ user@yourserver.com:/var/www/inventory-tracker/
```

## Step 7: Update Google OAuth Authorized URIs

1. Go back to Google Cloud Console
2. Update **OAuth 2.0 Client ID** with your production URL:
   - Add your deployed URL to **Authorized JavaScript origins**
   - Add your deployed URL + `/callback` to **Authorized redirect URIs**

Example for production:
- `https://yourdomain.com`
- `https://yourdomain.com/callback`

## Step 8: Verify Deployment

1. Visit your deployed application
2. Click the blue circle (profile button) in top-right
3. Click "Sign In with Google"
4. Grant permissions to access Google Sheets
5. Navigate to the Scanner page
6. Test QR scanning functionality

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Yes | Your Google OAuth Client ID |
| `VITE_GOOGLE_SHEET_ID` | Yes | Your Google Sheet ID |
| `VITE_GOOGLE_SHEET_NAME` | No | Name of inventory sheet (default: `2026-01-14`) |
| `VITE_GOOGLE_LOGS_SHEET_NAME` | No | Name of logs sheet (default: `logs`) |
| `VITE_API_BASE_URL` | No | Google Sheets API base URL |

## Troubleshooting

### "VITE_GOOGLE_CLIENT_ID is not configured"
- Ensure `.env.local` exists in the root directory
- Check the client ID is correctly copied from Google Cloud Console
- Restart the development server after updating `.env.local`

### "Failed to authenticate"
- Verify Google OAuth Consent Screen is set up
- Confirm authorized redirect URIs match your deployment URL
- Check browser console for detailed error messages

### "Sheet not found" or "Permission denied"
- Verify the sheet ID is correct
- Ensure the sheet is shared with the account used for OAuth
- Check that Google Sheets API is enabled in Google Cloud Console

### CORS errors
- This is handled by the backend API configuration
- Ensure your deployment URL is added to OAuth authorized origins

## Security Notes

⚠️ **Never commit `.env.local` to version control!**

- Add `.env.local` to `.gitignore`
- Always use environment variables for sensitive data
- Never expose API keys in client-side code (they're already visible here, so this is public)
- Use `.env.example` as a template for team members

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Review Google Cloud Console for API errors
3. Verify all environment variables are set correctly

---

**Last Updated:** January 19, 2026
**Version:** 1.0
