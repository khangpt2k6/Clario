# Deploy to Railway - Step by Step Guide

## Prerequisites
- GitHub account with your code pushed
- Railway account (free tier available)
- Supabase project set up

## Backend Deployment

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Railway will auto-detect Go
   - Set build command: `go build -o main .`
   - Set start command: `./main`
   - Set root directory: `backend`

4. **Environment Variables**
   - Add your Supabase credentials:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Set `GIN_MODE=release`
   - Set `PORT=8080`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Frontend Deployment

1. **Create Static Site Service**
   - In your Railway project, click "New Service"
   - Select "Static Site"

2. **Configure Frontend**
   - Set source directory: `frontend`
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL
   - Example: `https://your-backend.railway.app`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Update Frontend API URL

After backend deployment, update your frontend to use the new API URL:

```javascript
// In your API calls, use the Railway backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

## Custom Domain (Optional)

1. **Add Custom Domain**
   - In Railway dashboard, go to your service
   - Click "Settings" → "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Point your domain to Railway's nameservers
   - Wait for DNS propagation

## Monitoring & Logs

- View logs in Railway dashboard
- Monitor performance metrics
- Set up alerts for downtime

## Cost Optimization

- Railway free tier: $5/month credit
- Scale down when not in use
- Use sleep mode for development projects
