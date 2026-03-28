# 🚀 Deployment Guide - Lifestyle Gym Africa Ltd

This guide will walk you through deploying your Lifestyle Gym Africa Ltd application in 3 simple steps.

## Step 1: Set Up Neon Postgres Database

### 1.1 Create Neon Account

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up for a free account
3. Click "Create a project"

### 1.2 Configure Database

- **Project Name:** `lifestyle-gym`
- **Database Name:** `neondb` (default)
- **Region:** Choose closest to your users (e.g., US East, EU West)

### 1.3 Get Connection String

1. Go to your project dashboard
2. Click "Connection Details"
3. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 1.4 Initialize Database

```bash
# Create .env file
cp .env.example .env

# Edit .env and paste your connection string
DATABASE_URL=your_connection_string_here

# Initialize database tables
npm run db:init
```

## Step 2: Deploy Backend to Render (Recommended)

### 2.1 Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Lifestyle Gym Africa Ltd backend"

# Create GitHub repository at github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/lifestyle-gym.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml` configuration
6. Click "Create Web Service"

### 2.3 Configure Environment Variables

In Render dashboard:

1. Go to "Environment" tab
2. Add variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string
3. Click "Save Changes"

### 2.4 Auto-Deploy is Enabled! ✅

Every time you push to `main` branch, Render will automatically deploy your changes.

## Alternative: Deploy to Railway

### 2.1 Push to GitHub (same as above)

### 2.2 Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect `Procfile`

### 2.3 Configure Environment Variables

1. Click on your service
2. Go to "Variables" tab
3. Add:
   - `DATABASE_URL` = Your Neon connection string

### 2.4 Auto-Deploy is Enabled! ✅

## Step 3: Update Frontend API URL

After deployment, update the API base URL in your HTML files:

### 3.1 Get Your Backend URL

- **Render:** `https://lifestyle-gym-api.onrender.com`
- **Railway:** `https://lifestyle-gym-api.up.railway.app`

### 3.2 Update HTML Files

In each HTML file, update the `API_BASE` variable:

```javascript
// In public/member.html
const API_BASE = "https://lifestyle-gym-api.onrender.com/api";

// In public/transformation.html
const API_BASE = "https://lifestyle-gym-api.onrender.com/api";

// In public/fitness.html
const API_BASE = "https://lifestyle-gym-api.onrender.com/api";
```

### 3.3 Push Changes

```bash
git add .
git commit -m "Update API URL for production"
git push
```

## 🎉 You're Live!

Your application is now deployed with:

- ✅ **Backend:** Node.js server on Render/Railway
- ✅ **Database:** Neon Postgres (serverless)
- ✅ **Auto-deploy:** Every push triggers automatic deployment
- ✅ **HTTPS:** Automatic SSL certificates
- ✅ **Scalability:** Handles traffic spikes automatically

## 📊 Verify Deployment

### Check Backend Health

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-03-28T15:45:00.000Z"
}
```

### Test API Endpoints

```bash
# Get all members
curl https://your-backend-url.onrender.com/api/members

# Get transformations
curl https://your-backend-url.onrender.com/api/transformations

# Get today's classes
curl https://your-backend-url.onrender.com/api/classes/today
```

## 🔧 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correctly set in environment variables
- Ensure Neon database is active (free tier pauses after inactivity)
- Check SSL mode is enabled (`?sslmode=require`)

### Deployment Fails

- Check build logs in Render/Railway dashboard
- Ensure `package.json` has correct `engines` field
- Verify all dependencies are in `dependencies` (not `devDependencies`)

### CORS Issues

- Backend already has CORS enabled
- If issues persist, update `FRONTEND_URL` in environment variables

## 📈 Monitoring

### Render Dashboard

- View logs: Dashboard → Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts: Dashboard → Settings → Notifications

### Railway Dashboard

- View logs: Click service → Deployments → View logs
- Monitor usage: Click service → Metrics

## 🔄 Updates & Maintenance

### Update Code

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Auto-deploy will handle the rest!
```

### Database Migrations

```bash
# Update db/init.js with new tables/columns
# Then run:
npm run db:init
```

## 💰 Cost Estimate

### Free Tier Limits

- **Render:** 750 hours/month free
- **Railway:** $5 credit/month (enough for small apps)
- **Neon:** 3GB storage, 100 hours compute/month free

### Scaling

- Upgrade to paid plans when you exceed free limits
- Render: $7/month for always-on service
- Railway: Pay-as-you-go pricing

## 🎯 Next Steps

1. **Custom Domain:** Add your domain in Render/Railway settings
2. **SSL Certificate:** Automatic with Render/Railway
3. **CDN:** Add Cloudflare for faster global delivery
4. **Monitoring:** Set up uptime monitoring (UptimeRobot, Pingdom)
5. **Backups:** Enable automatic database backups in Neon

---

**Need Help?**

- Render Docs: [render.com/docs](https://render.com/docs)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Neon Docs: [neon.tech/docs](https://neon.tech/docs)
