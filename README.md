# Make Bold Solutions

A modern, 100% static website built with React 19, Vite 7, TypeScript, and TailwindCSS 4. Optimized for GitHub Pages deployment.

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at: http://localhost:5010

3. **Build for production**
   ```bash
   npm run build              # Standard build
   npm run build:github       # Build with GitHub Pages base path
   ```

   The built site will be in the `docs/` directory.

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server on port 5010
- `npm run build` - Complete build pipeline (clean, lint, type-check, test, build)
- `npm run build:github` - Build for GitHub Pages with correct base path
- `npm run clean` - Remove the docs/ directory
- `npm run lint` - Run ESLint with strict rules
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests (placeholder for now)
- `npm run preview` - Preview the production build locally

## Project Structure

```
MakeBoldSolutionsCom/
├── src/                    # All source code
│   ├── assets/            # Images and brand assets
│   │   └── generated_images/
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── pages/            # Page components
│   ├── public/           # Static assets (copied to build)
│   │   ├── favicon.png
│   │   ├── opengraph.jpg
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── 404.html      # SPA fallback for GitHub Pages
│   │   └── .nojekyll     # Prevents Jekyll processing
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles & theme
├── docs/                 # Build output (committed for GitHub Pages)
├── index.html            # Entry HTML
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
└── components.json       # shadcn/ui configuration
```

## Technology Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool and dev server
- **TailwindCSS 4** - Styling with @tailwindcss/vite plugin
- **shadcn/ui** - Customizable component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Building for Production

The build process includes:
1. **Clean** - Removes previous build artifacts
2. **Lint** - ESLint validation (zero warnings allowed)
3. **Type-check** - TypeScript compilation check
4. **Test** - Runs test suite
5. **Build** - Vite production build

Standard build (for custom domain or other hosting):
```bash
npm run build
```

The `docs/` directory will contain 100% static files ready for deployment.

### GitHub Pages Deployment

This project generates a 100% static site optimized for GitHub Pages:

**Initial Setup:**
1. In GitHub repository settings, enable GitHub Pages
2. Set source to **"main branch /docs folder"**
3. Save settings

**Deploy Updates:**
```bash
npm run build:github        # Build with /MakeBoldSolutionsCom/ base path
git add docs/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your site will be live at: `https://<username>.github.io/MakeBoldSolutionsCom/`

**What Makes It 100% Static:**
- ✅ No server-side rendering required
- ✅ All content pre-rendered at build time
- ✅ SPA routing handled via 404.html fallback
- ✅ `.nojekyll` prevents Jekyll processing
- ✅ Correct base paths for subdirectory hosting
- ✅ All assets fingerprinted and cached
- ✅ Fully optimized CSS and JavaScript bundles

**Custom Domain (Optional):**
- Add a `CNAME` file to `public/` with your domain name
- Configure DNS with your domain provider (A or CNAME record)
- Use `npm run build` (without `:github` suffix) for root domain hosting
- GitHub Pages will automatically use custom domain

### Other Hosting Options

The `docs/` folder contains standard static HTML/CSS/JS and works with:
- **Netlify** - Drag & drop `docs/` folder or connect Git
- **Vercel** - Import project, set output directory to `docs`
- **Azure Static Web Apps** - Point to `docs/` directory
- **AWS S3 + CloudFront** - Upload `docs/` contents
- **Any static hosting** - Upload files from `docs/`

## Development

The site uses:
- Vite's hot module replacement for instant updates during development
- TypeScript for type safety and IntelliSense
- TailwindCSS 4 with inline `@theme` configuration
- Framer Motion for smooth page animations
- ESLint for code quality
- Path aliases: `@/` → `src/`, `@assets/` → `src/assets/`

## Static Site Features

This is a Single Page Application (SPA) compiled to static assets:
- **Client-side rendering** - React hydrates the static HTML
- **No backend required** - Runs entirely in the browser
- **GitHub Pages compatible** - Custom 404.html handles routing
- **SEO optimized** - Meta tags, structured data, sitemap.xml
- **Performance** - Code splitting, lazy loading, optimized assets

## License

MIT
