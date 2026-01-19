# 🚀 Platform-Specific Deployment Guides

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
```bash
npm i -g vercel
vercel
```

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SHEET_NAME=2026-01-14
VITE_GOOGLE_LOGS_SHEET_NAME=logs
```

### Step 4: Deploy
```bash
vercel --prod
```

**Vercel Dashboard**: https://vercel.com/dashboard

---

## Netlify Deployment

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Connect GitHub to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`

### Step 3: Add Environment Variables
Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SHEET_NAME=2026-01-14
VITE_GOOGLE_LOGS_SHEET_NAME=logs
```

### Step 4: Deploy
Push to GitHub - Netlify auto-deploys!

**Netlify Dashboard**: https://app.netlify.com

---

## AWS Amplify Deployment

### Step 1: Install AWS CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify
```bash
amplify init
```

### Step 3: Add Hosting
```bash
amplify add hosting
# Select: Amazon CloudFront and S3
amplify push
```

### Step 4: Add Environment Variables
In AWS Amplify Console → Environment variables:
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_SHEET_ID`
- `VITE_GOOGLE_SHEET_NAME`
- `VITE_GOOGLE_LOGS_SHEET_NAME`

### Step 5: Deploy
```bash
amplify publish
```

---

## GitHub Pages Deployment

### Step 1: Update vite.config.ts
```typescript
export default defineConfig({
  base: '/inventory-tracker/', // Replace with your repo name
  // ... rest of config
})
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Push to GitHub
```bash
git add dist
git commit -m "Build for GitHub Pages"
git push origin main
```

### Step 4: Configure GitHub Pages
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /docs (after building)

---

## Self-Hosted (Linux/Ubuntu Server)

### Step 1: SSH to Server
```bash
ssh user@your-server.com
cd /var/www
```

### Step 2: Clone Repository
```bash
git clone https://github.com/yourusername/inventory-tracker.git
cd inventory-tracker
```

### Step 3: Setup Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Create Environment File
```bash
nano .env.local
# Add your configuration:
# VITE_GOOGLE_CLIENT_ID=...
# VITE_GOOGLE_SHEET_ID=...
# VITE_GOOGLE_SHEET_NAME=2026-01-14
# VITE_GOOGLE_LOGS_SHEET_NAME=logs
```

### Step 6: Build
```bash
npm run build
```

### Step 7: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start npm --name "inventory-tracker" -- start
pm2 startup
pm2 save
```

### Step 8: Setup Nginx (Reverse Proxy)
```bash
sudo apt-get install nginx

sudo nano /etc/nginx/sites-available/inventory-tracker
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/inventory-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Docker Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

### Step 2: Create .dockerignore
```
node_modules
.env.local
dist
.git
```

### Step 3: Build Image
```bash
docker build -t inventory-tracker:latest .
```

### Step 4: Run Container
```bash
docker run -d \
  --name inventory-tracker \
  -p 80:3000 \
  -e VITE_GOOGLE_CLIENT_ID=your_id \
  -e VITE_GOOGLE_SHEET_ID=your_sheet_id \
  inventory-tracker:latest
```

### Step 5: Push to Docker Hub (Optional)
```bash
docker tag inventory-tracker:latest yourusername/inventory-tracker:latest
docker push yourusername/inventory-tracker:latest
```

---

## Heroku Deployment (Legacy)

⚠️ **Note**: Heroku free tier ended. Use alternatives above.

### Step 1: Install Heroku CLI
```bash
curl https://cli.heroku.com/install.sh | sh
heroku login
```

### Step 2: Create Heroku App
```bash
heroku create your-app-name
```

### Step 3: Add Buildpack
```bash
heroku buildpacks:add https://github.com/timarenz/heroku-buildpack-nodejs-vite
```

### Step 4: Set Environment Variables
```bash
heroku config:set VITE_GOOGLE_CLIENT_ID=your_id
heroku config:set VITE_GOOGLE_SHEET_ID=your_sheet_id
heroku config:set VITE_GOOGLE_SHEET_NAME=2026-01-14
heroku config:set VITE_GOOGLE_LOGS_SHEET_NAME=logs
```

### Step 5: Deploy
```bash
git push heroku main
```

---

## Comparison Table

| Platform | Cost | Setup Time | Auto-Deploy | Best For |
|----------|------|------------|------------|----------|
| **Vercel** | Free-$20 | 5 min | ✅ Yes | Production |
| **Netlify** | Free-$19 | 5 min | ✅ Yes | Static sites |
| **AWS Amplify** | Free-$25 | 15 min | ✅ Yes | AWS ecosystem |
| **GitHub Pages** | Free | 10 min | ✅ Yes | Public projects |
| **Self-Hosted** | $5+/mo | 30 min | ❌ Manual | Full control |
| **Docker** | Variable | 20 min | ✅ Optional | Containers |

---

## Post-Deployment Verification

### For All Platforms:

1. **Test Sign-In**
   ```
   Visit your URL → Click profile circle → Sign In with Google
   ```

2. **Check Console**
   ```
   Press F12 → Console tab → Look for errors
   ```

3. **Test Core Features**
   - ✅ Sign in/out
   - ✅ Navigate to scanner
   - ✅ Camera access
   - ✅ View inventory

4. **Monitor Logs**
   - Vercel: Vercel Dashboard → Logs
   - Netlify: Netlify Dashboard → Logs
   - AWS: CloudWatch Logs
   - Self-hosted: Server logs

---

## Troubleshooting

### OAuth Not Working
```
Solution: Update Redirect URIs in Google Cloud Console
to match your deployment URL
```

### 404 Errors
```
Solution: Check build output and verify dist/ files exist
```

### Blank White Page
```
Solution: 
1. Check browser console for errors (F12)
2. Verify environment variables are set
3. Check network tab for failed requests
```

### Slow Loading
```
Solution:
1. Enable CDN caching
2. Optimize images
3. Use production build (npm run build)
```

---

**Choose the platform that best fits your needs!**

For most users, **Vercel** or **Netlify** are recommended for ease and speed.
