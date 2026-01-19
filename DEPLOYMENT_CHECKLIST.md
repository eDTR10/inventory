# Inventory Tracker - Deployment Checklist

## Pre-Deployment Setup ✓

- [ ] All TypeScript compilation errors resolved
- [ ] All unused imports/functions removed
- [ ] `.env.local` file created with all required variables
- [ ] `.env.example` file contains template with all variables
- [ ] `.gitignore` excludes `.env.local` and sensitive files
- [ ] Google OAuth Client ID obtained from Google Cloud Console
- [ ] Google Sheet created with proper column structure
- [ ] Google Sheets API enabled in Google Cloud Console
- [ ] OAuth Consent Screen configured
- [ ] Local development tested and working

## Environment Variables Checklist

### Required
- [ ] `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- [ ] `VITE_GOOGLE_SHEET_ID` - Your Google Sheet ID

### Optional (with defaults)
- [ ] `VITE_GOOGLE_SHEET_NAME` - Default: `2026-01-14`
- [ ] `VITE_GOOGLE_LOGS_SHEET_NAME` - Default: `logs`
- [ ] `VITE_API_BASE_URL` - Default: `https://sheets.googleapis.com/v4/spreadsheets/`

## Google Sheet Structure Verification

Your Google Sheet should have:

**Inventory Sheet (2026-01-14):**
- [ ] Column A: `itemName` (text)
- [ ] Column B: `image` (optional, for item images)
- [ ] Column C: `quantity` (number)

**Logs Sheet (logs):**
- [ ] Column A: `user` (email)
- [ ] Column B: `action` (CREATE/READ/UPDATE/DELETE)
- [ ] Column C: `date_time` (timestamp)
- [ ] Column D: `changes` (description)

## Production Deployment Checklist

### 1. Before Building
- [ ] All environment variables set in `.env.local`
- [ ] All compilation errors resolved (`npm run build` succeeds)
- [ ] Local testing completed
  - [ ] User can sign in with Google
  - [ ] Inventory CRUD operations work
  - [ ] QR scanning works
  - [ ] Audit logs are recorded

### 2. Build
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created successfully
- [ ] No build errors in console

### 3. Before Publishing
- [ ] Update Google OAuth Redirect URIs to match production URL
- [ ] Add production URL to OAuth Authorized JavaScript Origins
- [ ] Verify environment variables are set in hosting platform
- [ ] Test OAuth flow redirects correctly

### 4. After Deployment
- [ ] Visit production URL
- [ ] Verify Google Sign-In works
- [ ] Test QR code generation and scanning
- [ ] Verify data is saved to Google Sheets
- [ ] Check browser console for errors
- [ ] Review Google Cloud Console for API errors

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "VITE_GOOGLE_CLIENT_ID is not set" | Add to `.env.local` and restart dev server |
| OAuth fails on production | Update Redirect URIs in Google Cloud Console |
| "Permission denied" on Google Sheets | Share sheet with your Google account or ensure OAuth has spreadsheets scope |
| CORS errors | Verify authorized origins in Google Cloud Console include your domain |
| QR scanner not working | Check browser permissions for camera access |

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (never commit!)
- [ ] API keys not hardcoded in source files
- [ ] Using environment variables for all sensitive data
- [ ] HTTPS enabled on production (required for camera access)
- [ ] OAuth Consent Screen reviewed and approved
- [ ] Verified only necessary scopes requested
- [ ] No console.log statements with sensitive data in production

## Deployment Platforms

### Vercel (Recommended)
- [ ] Connect GitHub repository
- [ ] Set environment variables in project settings
- [ ] Auto-deploy on push

### Netlify
- [ ] Connect GitHub repository
- [ ] Set environment variables in Site Settings
- [ ] Configure build command: `npm run build`
- [ ] Configure publish directory: `dist`

### Self-Hosted
- [ ] Server has Node.js installed
- [ ] Set environment variables on server
- [ ] Configure reverse proxy (nginx/Apache) if needed
- [ ] Set up SSL certificate for HTTPS
- [ ] Configure auto-restart if process fails

## Post-Deployment

- [ ] Monitor Google Cloud Console for API errors
- [ ] Check browser console for client-side errors
- [ ] Verify users can authenticate
- [ ] Confirm data persistence in Google Sheets
- [ ] Test on mobile devices (camera access)
- [ ] Monitor performance and loading times

## Rollback Plan

If issues occur:
1. Revert to previous commit
2. Check environment variables on hosting platform
3. Verify Google OAuth settings haven't changed
4. Check Google Sheets still accessible
5. Review error logs and Google Cloud Console

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Status:** _______________
