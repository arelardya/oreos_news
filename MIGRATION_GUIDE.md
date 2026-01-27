# Migration Guide: Redis to Neon Postgres

## What Changed?

✅ **Database:** Redis (30 MB) → Neon Postgres (3 GB)  
✅ **Storage:** 100x more space!  
✅ **Package:** `ioredis` → `@neondatabase/serverless`  
✅ **Bonus:** Ready for crossword game feature

---

## Migration Steps

### 1. Setup Neon Database (5 minutes)

Follow the steps in [VERCEL_SETUP.md](VERCEL_SETUP.md):
1. Create Neon account at https://neon.tech
2. Create new project: `oreos-news-db`
3. Copy connection string
4. Add to Vercel env vars as `DATABASE_URL`

### 2. Initialize Database Schema

In Neon Console → SQL Editor, run:
```sql
-- Copy and paste content from database/schema.sql
```

This creates:
- `articles` table
- `crossword_games` table (for future!)
- `crossword_scores` table (for leaderboard!)

### 3. Migrate Existing Articles (Optional)

If you have articles in Redis, export them first:

```javascript
// Run this in your admin dashboard console or create a temp endpoint
const response = await fetch('/api/articles?includeScheduled=true');
const articles = await response.json();
console.log(JSON.stringify(articles, null, 2));
```

Then manually insert them via Neon SQL Editor or create articles again through your admin panel.

### 4. Update Environment Variables

**Remove (no longer needed):**
- ❌ `REDIS_URL` or `KV_URL`
- ❌ `KV_REST_API_URL`
- ❌ `KV_REST_API_TOKEN`
- ❌ `KV_REST_API_READ_ONLY_TOKEN`

**Add:**
- ✅ `DATABASE_URL` (from Neon)

### 5. Deploy

```bash
git add .
git commit -m "Migrate from Redis to Neon Postgres"
git push
```

Vercel will auto-deploy with the new database!

---

## Code Changes Summary

### Package Changes
```bash
npm uninstall ioredis
npm install @neondatabase/serverless
```

### New Files
- `lib/db.ts` - Database connection
- `database/schema.sql` - Database schema
- This migration guide

### Updated Files
- `app/api/articles/route.ts` - Now uses SQL queries
- `VERCEL_SETUP.md` - Updated setup instructions
- `package.json` - Updated dependencies

---

## Testing Checklist

After migration, test these features:

- [ ] View all articles on homepage
- [ ] View individual article page
- [ ] Create new article (admin)
- [ ] Edit existing article (admin)
- [ ] Delete article (admin)
- [ ] Schedule article publication
- [ ] Like button functionality
- [ ] Search articles

---

## Troubleshooting

### "DATABASE_URL is not set" error
- Go to Vercel → Settings → Environment Variables
- Make sure `DATABASE_URL` is added
- Redeploy the project

### "relation does not exist" error
- Go to Neon Console → SQL Editor
- Run the schema from `database/schema.sql`
- Make sure all tables are created

### No articles showing
- Check if articles were migrated
- Create a test article through admin panel
- Check Vercel deployment logs for errors

---

## Future Features Ready!

With Postgres, you can now easily add:

### Crossword Game (Schema already created!)
```sql
-- Already in schema.sql:
-- crossword_games table
-- crossword_scores table
```

### Possible Future Features:
- User accounts & profiles
- Article comments system
- Advanced search with filters
- Article tags & categories
- Newsletter subscriptions
- Analytics & page views
- Article bookmarks/favorites

---

## Rollback (if needed)

If you need to rollback to Redis:

1. Checkout previous commit: `git checkout <previous-commit>`
2. Restore Redis env vars in Vercel
3. Redeploy

---

## Need Help?

- Neon Docs: https://neon.tech/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: Create an issue in your repo
