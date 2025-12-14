# Make Bold Solutions

A modern static website built with React, Vite, and TypeScript.

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
   npm run build
   ```

   The built site will be in the `dist/` directory.

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run check` - Run TypeScript type checking

## Project Structure

```
MakeBoldSolutionsCom/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       │   └── ui/        # UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utilities
│       ├── pages/         # Page components
│       ├── App.tsx        # Main App component
│       └── main.tsx       # Entry point
├── attached_assets/       # Project assets (images, etc.)
│   └── generated_images/
├── dist/                  # Build output (generated)
└── vite.config.ts         # Vite configuration
```

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Styling with @tailwindcss/vite plugin
- **Radix UI** - Headless UI primitives (toast)
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Building for Production

Build the application:
```bash
npm run build
```

The `docs/` directory will contain the static files ready for deployment.

### GitHub Pages Deployment

This project is configured to deploy via GitHub Pages:

**Initial Setup:**
1. In GitHub repository settings, enable GitHub Pages and set source to "main branch /docs folder"

**Deploy Updates:**
1. Build the site: `GITHUB_PAGES=true npm run build` (on Windows: `$env:GITHUB_PAGES='true'; npm run build`)
2. Commit the `docs/` folder to your repository
3. Push to GitHub - your site will automatically update

**Live at:** `https://<username>.github.io/MakeBoldSolutionsCom/`

**Custom Domain (Optional):**
- Add a `CNAME` file to `client/public/` with your domain
- Configure DNS with your domain provider
- Use `npm run build` (without GITHUB_PAGES flag) when using custom domain

Alternatively, deploy to other static hosting services (Netlify, Vercel, Azure Static Web Apps, etc.).

## Development

The site uses:
- Vite's hot module replacement for instant updates during development
- TypeScript for type safety
- TailwindCSS 4 with Vite plugin for styling
- Framer Motion for smooth animations

## License

MIT
