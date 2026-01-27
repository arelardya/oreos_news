# Setup Guide for Vercel Deployment with Neon Database

## Step 1: Create Vercel Blob Storage (for images)

1. Go to https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "Blob"
4. Name it: `oreos-news-images`
5. Click "Create"
6. Go to your project → Settings → Environment Variables
7. Vercel should auto-add `BLOB_READ_WRITE_TOKEN`

## Step 2: Create Neon Database (for articles & crossword games)

### Why Neon?
- ✅ **3 GB free tier** (100x more than Redis 30 MB!)
- ✅ Serverless Postgres (perfect for Vercel)
- ✅ SQL database (better for structured data)
- ✅ Perfect for articles + crossword games

### Setup Steps:

1. Go to https://neon.tech
2. Sign up/Sign in with your GitHub account
3. Click "Create Project"
4. Name it: `oreos-news-db`
5. Select closest region to your users
6. Click "Create Project"
7. Copy the connection string (starts with `postgresql://`)
8. Go to Vercel → Your Project → Settings → Environment Variables
9. Add new variable:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environments: Production, Preview, Development

## Step 3: Initialize Database Schema

1. Go to Neon Console → SQL Editor
2. Copy and paste the content from `database/schema.sql`
3. Click "Run" to create tables
4. This creates:
   - Articles table (for your news articles)
   - Crossword games table (for future crossword feature!)
   - Crossword scores table (for leaderboard)

## Step 4: Verify Environment Variables

Go to your project → Settings → Environment Variables and make sure you have:
- ✅ BLOB_READ_WRITE_TOKEN
- ✅ DATABASE_URL

## Step 5: Redeploy

After setting up, trigger a new deployment:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment
- Or push new code to trigger auto-deployment

## Done! 🎉

Your articles are now stored in Neon Postgres with:
- **3 GB storage** vs 30 MB Redis
- Permanent storage (no data loss)
- SQL queries (faster & more flexible)
- Ready for crossword game feature!
