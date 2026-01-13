# Setup Guide for Vercel Deployment

## Step 1: Create Vercel Blob Storage (for images)

1. Go to https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "Blob"
4. Name it: `oreos-news-images`
5. Click "Create"
6. Go to your project → Settings → Environment Variables
7. Vercel should auto-add `BLOB_READ_WRITE_TOKEN`

## Step 2: Create Vercel KV Database (for articles)

1. Go to https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "KV" (Redis)
4. Name it: `oreos-news-articles`
5. Click "Create"
6. Connect it to your project
7. Vercel will auto-add these environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

## Step 3: Verify Environment Variables

Go to your project → Settings → Environment Variables and make sure you have:
- ✅ BLOB_READ_WRITE_TOKEN
- ✅ KV_URL
- ✅ KV_REST_API_URL
- ✅ KV_REST_API_TOKEN
- ✅ KV_REST_API_READ_ONLY_TOKEN

## Step 4: Redeploy

After setting up both databases, trigger a new deployment:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment
- Or push new code to trigger auto-deployment

## Done! 🎉

Your articles will now be stored permanently in Vercel KV (Redis) and won't disappear after serverless function restarts!
