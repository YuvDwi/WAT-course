# Railway Deployment Guide

## Overview
Your CoursePick app consists of two services that need to be deployed separately:

1. **Python FastAPI Backend** (main.py + recommender)
2. **Next.js Frontend** (React app)

## Step 1: Deploy Python Backend to Railway

1. Create a new Railway project for the backend
2. Connect your GitHub repo
3. Railway will automatically detect Python and use `requirements.txt`
4. Set the start command: `python3 main.py`
5. Note the deployment URL (e.g., `https://your-backend-name.railway.app`)

## Step 2: Deploy Next.js Frontend

### Option A: Deploy Frontend to Railway
1. Create another Railway service for the frontend
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-name.railway.app`
3. Railway will automatically detect Next.js

### Option B: Deploy Frontend to Vercel/Netlify
1. Deploy to Vercel or Netlify
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-name.railway.app`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-name.railway.app
```

### Backend (Railway Environment Variables)
No additional env vars needed - all dependencies are included.

## Files Ready for Deployment

✅ `requirements.txt` - Python dependencies
✅ `main.py` - FastAPI backend with CORS configured
✅ `reccomender.py` - ML recommendation engine  
✅ `pdfparser.py` - PDF text extraction
✅ `embedded_courses.json` - Course database
✅ `package.json` - Next.js dependencies
✅ Frontend configured for environment variables

## Testing Production Setup

1. Deploy backend first
2. Test backend endpoint: `https://your-backend-name.railway.app/docs`
3. Deploy frontend with backend URL
4. Test full PDF upload flow

Your app is ready for Railway deployment! 🚀
