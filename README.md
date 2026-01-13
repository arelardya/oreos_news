# Ghalyndra's Journal

A cute, playful article-based website built with Next.js 14, featuring an admin dashboard with authentication, dark mode, and image upload functionality.

## Features

- 🎨 Beautiful pink and white color scheme
- 🌙 Dark mode support with system preference detection
- 🔐 Admin authentication system
- 📱 Fully responsive layout (mobile-first)
- 📝 Article management system with admin dashboard
- 🖼️ Image upload functionality with local storage
- 📹 Support for embedded videos (YouTube)
- ✨ Smooth animations and transitions
- 🎯 SEO-friendly structure
- 💫 Recommendation system for related articles
- 🔤 Ubuntu font family

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Image Optimization:** Next.js Image component
- **Deployment:** Vercel-ready

## Color Scheme

- **Primary:** #FF69B4 (Hot Pink)
- **Primary Dark:** #FF1493 (Deep Pink)
- **Accent:** #FFB6C1 (Light Pink)
- **Background:** White (Light mode) / Gray-900 (Dark mode)

## Project Structure

```
├── app/
│   ├── about/              # About page
│   ├── admin/              # Admin login page
│   │   └── dashboard/      # Admin dashboard (protected)
│   ├── api/
│   │   ├── articles/       # API routes for article CRUD
│   │   └── upload/         # Image upload API
│   ├── article/
│   │   └── [slug]/         # Dynamic article pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with Ubuntu font
│   └── page.tsx            # Home page
├── components/
│   ├── ArticleCard.tsx     # Article card component
│   ├── ArticleGrid.tsx     # Article grid layout
│   ├── BackButton.tsx      # Navigation back button
│   ├── DarkModeToggle.tsx  # Dark/light mode switcher
│   ├── Footer.tsx          # Site footer
│   ├── HeroSection.tsx     # Hero section component
│   ├── ImageUpload.tsx     # Image upload component
│   ├── Navbar.tsx          # Navigation bar
│   ├── QuoteSection.tsx    # Quote display section
│   ├── RecommendationGrid.tsx  # Related articles grid
│   └── ThemeProvider.tsx   # Dark mode context provider
├── data/
│   └── articles.ts         # Article data source
├── lib/
│   └── articles.ts         # Article utility functions
├── public/
│   └── uploads/            # Uploaded images directory
├── types/
│   └── article.ts          # Article TypeScript interface
└── vercel.json             # Vercel configuration
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Pages

### Home Page (`/`)
- Hero section with gradient background
- Inspirational quote section
- Grid of all articles with thumbnails

### Article Page (`/article/[slug]`)
- Full article content with optional image
- Embedded video support (YouTube)
- Author signature
- Back navigation button
- Recommendations for 3 related articles

### About Page (`/about`)
- Currently empty, ready for custom content

### Admin Login (`/admin`)
- Simple password authentication
- Default password: **admin123**
- Stores auth in localStorage

### Admin Dashboard (`/admin/dashboard`)
- Protected route (requires authentication)
- Add new articles with image upload
- Edit existing articles
- Delete articles
- Real-time preview of uploaded images
- Logout functionality

## Features in Detail

### Dark Mode
- Toggle between light and dark themes
- Automatic system preference detection
- Persistent theme selection (localStorage)
- Smooth transitions between themes

### Image Upload
- Upload images directly from admin dashboard
- Automatic image preview
- Stored in `/public/uploads/`
- Supports thumbnails and main images

### Authentication
- Simple password-based login
- Protected admin routes
- Session persistence with localStorage
- Easy logout functionality

## Article Structure

Each article includes:
- **title:** Article title
- **slug:** URL-friendly identifier
- **date:** Publication date (YYYY-MM-DD)
- **content:** Article text content (supports multiple paragraphs)
- **imageUrl:** (Optional) Main article image
- **thumbnail:** (Optional) Thumbnail for article cards
- **videoUrl:** (Optional) YouTube embed URL

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy!

### Environment Setup

No environment variables needed for basic deployment.

### Important Notes for Vercel

- Images uploaded via admin will be stored in serverless function memory
- For production, consider using:
  - Vercel Blob Storage
  - Cloudinary
  - AWS S3
  - Other cloud storage solutions

### Vercel Configuration

The project includes `vercel.json` for proper routing configuration.

## Customization

### Changing Colors

Update colors in `tailwind.config.ts`:
```typescript
colors: {
  primary: '#FF69B4',
  'primary-dark': '#FF1493',
  accent: '#FFB6C1',
  // Add your custom colors
}
```

### Changing Admin Password

Update the password check in `/app/admin/page.tsx`:
```typescript
if (password === 'your-new-password') {
  // ...
}
```

### Updating Quote

Edit `components/QuoteSection.tsx` to change the inspirational quote.

### Adding About Content

Edit `app/about/page.tsx` to add your about page content.

## Design Philosophy

- **Pink color scheme** that's warm and inviting
- **Rounded cards** with large border-radius for a soft feel
- **Subtle animations** that enhance without overwhelming
- **Clean typography** using Ubuntu font for excellent readability
- **Dark mode** for comfortable reading in any lighting
- **Mobile-first** responsive design

## Security Considerations

⚠️ **Important for Production:**

1. Replace the simple password authentication with proper auth (NextAuth.js, Clerk, etc.)
2. Add CSRF protection
3. Implement rate limiting
4. Use environment variables for sensitive data
5. Add proper session management
6. Consider adding role-based access control

## Future Enhancements

- Database integration (MongoDB, PostgreSQL, Supabase)
- Vercel Blob Storage for images
- Categories/tags for articles
- Search functionality
- Comments system
- RSS feed
- Share buttons
- Article views counter
- SEO metadata customization per article

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal use.

---

Made with ❤️ by Ghalyndra
