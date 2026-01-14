# Scheduled Publishing Feature

## Overview
Articles can now be scheduled for future publication. This feature is **only available for ghalyndra's account**.

## How It Works

### For Ghalyndra (Scheduled Publishing Enabled)

1. **Create Article**: When creating a new article in the admin dashboard, you'll see publishing options:
   - **Publish Now**: Immediately publishes the article (default)
   - **Schedule for Later**: Opens a date/time picker modal

2. **Schedule Article**:
   - Select "Schedule for Later"
   - Fill in the article details
   - Click "Add Article"
   - A modal will open to select the publish date and time
   - Confirm the schedule
   - The article will be saved with "Scheduled" status

3. **View Scheduled Articles**: 
   - Scheduled articles appear in your dashboard with a ⏰ badge
   - Shows the scheduled publish time
   - Can be edited or deleted before publishing

4. **Automatic Publishing**:
   - A cron job runs every 5 minutes on Vercel
   - Checks for scheduled articles that should be published
   - Automatically publishes articles when their scheduled time arrives

### For Masyanda (No Scheduling)
- Articles are published immediately when created
- No scheduling options available

### For Master Admin
- Can see all articles (including scheduled ones)
- Can see which author created each article

## Technical Details

### New Fields Added to Article Type
```typescript
status?: 'draft' | 'scheduled' | 'published';
scheduledPublishAt?: string; // ISO date string
```

### API Endpoints

1. **GET /api/articles** 
   - Query param: `includeScheduled=true` to include unpublished scheduled articles
   - Default: Only returns published articles or scheduled articles past their publish time

2. **POST /api/articles**
   - Accepts `status` and `scheduledPublishAt` fields
   - Creates scheduled articles

3. **GET /api/articles/publish-scheduled**
   - Cron job endpoint
   - Runs every 5 minutes
   - Automatically publishes scheduled articles that have reached their time

### Vercel Cron Configuration
Located in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/articles/publish-scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## Components

### DateTimePickerModal
- Standalone modal for selecting publish date and time
- Validates that selected time is in the future
- Displays confirmation message with formatted date/time
- Located in: `/components/DateTimePickerModal.tsx`

## User Experience

### Creating a Scheduled Article
1. Ghalyndra logs into the admin dashboard
2. Selects "Schedule for Later" option
3. Fills in article details (title, content, images, etc.)
4. Clicks "Add Article"
5. Date picker modal opens
6. Selects date and time
7. Clicks "Confirm"
8. Article is saved with scheduled status
9. Success message shows scheduled publish time

### Viewing Scheduled Articles
- Dashboard shows all articles (published and scheduled)
- Scheduled articles have:
  - Yellow "⏰ Scheduled" badge
  - Scheduled publish time displayed
  - Can be edited or deleted

### Editing Scheduled Articles
- Can edit article content before it publishes
- Current scheduled time is preserved
- Can change the scheduled time if needed

## Public View
- Scheduled articles do NOT appear on the public website until their scheduled time
- Only published articles (or scheduled articles past their time) are visible
- Ensures no premature exposure of scheduled content

## Important Notes
- Scheduled articles are published based on Vercel's server time
- Minimum resolution is 5 minutes (cron job interval)
- If server is down during scheduled time, article will publish on next cron run
- Scheduling only available for ghalyndra's account
- Once published, scheduled articles cannot be un-published (must delete and recreate)
