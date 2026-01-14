# How to Clear All Articles from Database

## Option 1: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard/stores
2. Find your `oreos-news-articles` KV database
3. Click on it
4. Go to the "Data" tab
5. Find the key named `articles`
6. Click the delete icon (trash can) next to it
7. Confirm deletion

This will delete all articles (including those without usernames).

## Option 2: Using Redis CLI

If you have Redis CLI installed locally:

```bash
redis-cli -u YOUR_REDIS_URL
DEL articles
```

Replace `YOUR_REDIS_URL` with your `REDIS_URL` environment variable.

## Option 3: Create an API endpoint (temporary)

You can create a temporary admin endpoint to clear all articles:

1. Create a file: `app/api/articles/clear/route.ts`
2. Add this code:

```typescript
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function DELETE() {
  try {
    const redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
    });
    
    await redis.del('articles');
    redis.disconnect();
    
    return NextResponse.json({ success: true, message: 'All articles cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear articles' }, { status: 500 });
  }
}
```

3. Deploy or run locally
4. Visit: `http://yoursite.com/api/articles/clear` and send a DELETE request
5. **Delete this file after using it** for security

## After Clearing

Once you clear the database:
- All articles will be deleted
- Both Ghalyndra and Masyanda's articles will be removed
- The home page tabs will show empty
- You can start fresh by creating new articles with the proper author field
