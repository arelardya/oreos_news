# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click "Add New Project"
4. Import your Git repository
5. Vercel will automatically detect Next.js

### 3. Configure Build Settings

Vercel will auto-configure these settings:

- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

No changes needed unless you have custom requirements.

### 4. Deploy

Click "Deploy" and wait for the build to complete (usually 1-2 minutes).

## Environment Variables

Currently, no environment variables are required. If you add features later:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development

## Important Notes for Production

### Image Storage Limitation

⚠️ **Critical:** Vercel's serverless functions are stateless. Images uploaded through the admin panel will NOT persist between deployments.

### Recommended Solutions:

#### Option 1: Vercel Blob Storage (Recommended)

1. Install Vercel Blob SDK:
```bash
npm install @vercel/blob
```

2. Update `/app/api/upload/route.ts`:
```typescript
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const blob = await put(file.name, file, {
    access: 'public',
  });

  return Response.json({ url: blob.url });
}
```

3. Add environment variable in Vercel:
   - `BLOB_READ_WRITE_TOKEN` (automatically provided by Vercel)

#### Option 2: Cloudinary

1. Install Cloudinary SDK:
```bash
npm install cloudinary
```

2. Add environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### Option 3: AWS S3

Use AWS SDK and S3 bucket for permanent storage.

## Custom Domain

### Add Your Domain

1. Go to project settings > Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains.

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images. For Vercel:

- Images are served through Vercel's edge network
- Automatic WebP conversion
- Lazy loading by default

### Caching

Vercel automatically caches:
- Static assets
- API routes (when appropriate)
- Generated pages

## Monitoring

### Analytics

Enable Vercel Analytics:

1. Go to project settings
2. Navigate to Analytics
3. Enable Vercel Analytics

### Speed Insights

Enable Speed Insights for Core Web Vitals tracking.

## Database Integration (Future)

### Recommended Options:

1. **Vercel Postgres**
   - Serverless SQL database
   - Fully managed by Vercel
   - Easy integration

2. **MongoDB Atlas**
   - Free tier available
   - Good for document storage
   - Easy setup

3. **Supabase**
   - PostgreSQL database
   - Built-in authentication
   - Real-time capabilities

4. **PlanetScale**
   - MySQL-compatible
   - Serverless
   - Great developer experience

## Continuous Deployment

Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches
- **Preview:** Every pull request

## Build & Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server locally
npm start

# Lint
npm run lint
```

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`

### Images Not Loading

1. Check if images are in `/public` directory
2. Verify image paths (use `/` not `./`)
3. Check Next.js image configuration in `next.config.js`

### Admin Login Not Working

1. Clear browser localStorage
2. Try incognito/private window
3. Check browser console for errors

## Security Recommendations

Before going to production:

1. **Change Admin Password**
   - Update in `/app/admin/page.tsx`
   - Or implement proper authentication

2. **Add Environment Variables**
   - For sensitive data
   - For API keys

3. **Implement Rate Limiting**
   - Protect API routes
   - Prevent abuse

4. **Add HTTPS Only**
   - Vercel does this automatically
   - Verify in production

5. **Content Security Policy**
   - Add security headers
   - Configure in `next.config.js`

## Cost Considerations

### Free Tier Includes:

- Unlimited deployments
- Automatic HTTPS
- 100 GB bandwidth/month
- Serverless function executions
- Edge network

### Paid Features:

- Vercel Blob Storage (paid after free tier)
- Team collaboration
- Advanced analytics
- Password protection
- More bandwidth

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] All dependencies in package.json
- [ ] Build succeeds locally
- [ ] Environment variables configured (if any)
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Image storage solution chosen
- [ ] Security measures implemented
- [ ] Admin password changed
- [ ] README updated

---

Happy Deploying! 🚀
