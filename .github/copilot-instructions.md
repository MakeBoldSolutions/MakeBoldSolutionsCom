# Make Bold Solutions Copilot Instructions

## Project Overview
Modern static marketing website for Make Bold Solutions, built with React 19, Vite 7, TypeScript, and TailwindCSS 4. This is a single-page application (SPA) with no backend or routing—all content lives in [src/pages/home.tsx](../src/pages/home.tsx).

## Architecture & Structure

### Key Design Decisions
- **Clean root structure**: Config files at root, all source code in `/src`
- **TailwindCSS 4 with Vite plugin**: Uses `@tailwindcss/vite`, not PostCSS plugin. Configured in [vite.config.ts](../vite.config.ts)
- **Path aliases**: `@/` → `src/`, `@assets/` → `src/assets/`. Must use these consistently across the codebase
- **Custom Vite plugin**: [vite-plugin-meta-images.ts](../vite-plugin-meta-images.ts) auto-updates OpenGraph image URLs for deployment domains
- **Dark theme by default**: CSS custom properties in [src/index.css](../src/index.css) define dark slate theme with vibrant blue primary color

### Directory Layout
```
MakeBoldSolutionsCom/
├── src/                             # All source code
│   ├── pages/home.tsx              # Single-page app content (the whole site)
│   ├── components/ui/              # shadcn/ui components (customized)
│   ├── lib/utils.ts                # cn() utility for className merging
│   ├── hooks/                      # React hooks (use-toast, use-mobile)
│   ├── assets/                     # Images, brand assets, generated images
│   │   └── generated_images/      # Generated brand images
│   ├── public/                     # Static assets (favicon, opengraph, robots.txt)
│   ├── index.css                   # Global styles, TailwindCSS theme
│   ├── App.tsx                     # Root React component
│   └── main.tsx                    # Application entry point
├── index.html                      # Entry HTML
├── vite.config.ts                  # Vite build configuration
├── components.json                 # shadcn/ui configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
├── vite-plugin-meta-images.ts     # Custom plugin for meta tag injection
└── docs/                          # Build output (committed for GitHub Pages)
```

## Technology Stack & Component Patterns

### UI Component Library (shadcn/ui)
- Uses shadcn/ui components (badge, button, card, etc.) from [src/components/ui/](../src/components/ui/)
- **Customization**: Components have inline `@custom` or `Custom:` comments marking customizations from defaults
- **Styling approach**: Uses `class-variance-authority` (cva) for variant-based styling. See [button.tsx](../src/components/ui/button.tsx) as reference
- **className merging**: Always use `cn()` from `@/lib/utils` when combining classes
- Configuration in [components.json](../components.json) defines import aliases and style preferences

### Styling & Theming
- **TailwindCSS 4 inline theme**: Theme tokens defined in `@theme inline` block in [index.css](../src/index.css)
- **Custom classes**: `.glass-card` (frosted glass effect), `.text-gradient` (blue-to-teal gradient)
- **Design system**: Dark slate background (hsl(222 47% 11%)), vibrant blue primary (hsl(217 91% 60%))
- **Typography**: `font-sans` → Plus Jakarta Sans, `font-display` → Space Grotesk (both from Google Fonts)

### Animation & Interactions
- **Framer Motion**: Used for page entrance animations and scroll-triggered effects. See [home.tsx](../src/pages/home.tsx) for patterns
- **Toast notifications**: Sonner library via shadcn/ui's `<Toaster />` component. Use `useToast()` hook for programmatic toasts

## Development Workflows

### Running the Project
```bash
npm install              # Install dependencies
npm run dev              # Start dev server on http://localhost:5010
npm run build            # Build for production → dist/
npm run preview          # Preview production build
npm run check            # TypeScript type checking
```

**Important**: Dev server runs on port **5010**, not the Vite default 5173. This is hardcoded in [package.json](../package.json) and [vite.config.ts](../vite.config.ts).

### Build & Deployment
- Build outputs to `docs/` directory (not `src/docs/` despite Vite root)
- **GitHub Pages**: The `docs/` folder is committed to the repository and served via GitHub Pages
  - Use `GITHUB_PAGES=true npm run build` to set proper base path for subdirectory hosting
  - `.nojekyll` file prevents Jekyll processing
  - `404.html` provides SPA fallback
- Compatible with static hosting providers (GitHub Pages, Netlify, Vercel, Azure Static Web Apps)

## Code Conventions

### TypeScript
- **Strict mode enabled**: All strict checks active in [tsconfig.json](../tsconfig.json)
- **Import extensions**: `.tsx` files must not use extensions in imports (`@/components/ui/button`, not `@/components/ui/button.tsx`)
- **Types**: Prefer interface for component props, type for utility types. React 19 types from `@types/react`

### React Patterns
- **Functional components only**: No class components
- **Hooks**: Custom hooks in `@/hooks/` directory. Follow `use-*` naming convention
- **Event handlers**: Prefix with `handle` (e.g., `handleNotify`, `handleSubmit`)
- **Asset imports**: Import images from `@assets/` path alias, not relative paths

### Component Structure
- **Layout**: No router—all content in single `<Home />` component in [App.tsx](../src/App.tsx)
- **UI components**: Export both component and any associated types/utilities (see [button.tsx](../src/components/ui/button.tsx))
- **Accessibility**: Include `sr-only` spans for icon-only buttons, proper semantic HTML

## Important Files to Reference

- [vite.config.ts](../vite.config.ts) - Build config, path aliases, custom plugin setup
- [src/index.css](../src/index.css) - Theme variables, custom utilities, TailwindCSS 4 setup
- [src/pages/home.tsx](../src/pages/home.tsx) - Main app content, animation patterns, component usage
- [components.json](../components.json) - shadcn/ui configuration for adding new components
- [vite-plugin-meta-images.ts](../vite-plugin-meta-images.ts) - Custom build logic for OpenGraph images

## Common Tasks

### Adding a New UI Component
1. Use shadcn/ui CLI if component exists: `npx shadcn@latest add <component-name>`
2. Components install to `src/components/ui/` automatically (per [components.json](../components.json))
3. Customize variants in the component file if needed, mark with `@custom` or `Custom:` comments

### Adding New Images
- Brand/marketing images → `src/assets/generated_images/`
- Public assets (favicon, OG image) → `src/public/`
- Import using `@assets/` alias in code

### Styling New Components
1. Use TailwindCSS utility classes as primary approach
2. For complex variants, use `cva()` from `class-variance-authority`
3. Always merge classes with `cn()` utility: `cn(baseStyles, className)`
4. Reference existing theme tokens: `bg-background`, `text-primary`, etc.

### Deploying to GitHub Pages
1. Build with base path: `GITHUB_PAGES=true npm run build` (Windows: `$env:GITHUB_PAGES='true'; npm run build`)
2. Commit and push the `docs/` folder
3. Ensure GitHub Pages is enabled in repo settings (source: main branch /docs folder)
4. Files in `src/public/` (`.nojekyll`, `404.html`) are copied to `docs/` automatically during build

## Known Quirks & Gotchas

- **TailwindCSS v4**: Uses new `@import "tailwindcss"` syntax, not `@tailwind` directives
- **Vite root mismatch**: Vite root is now the project root, build outputs to `docs/`
- **TypeScript config**: Includes paths for `shared/` and `server/` that don't exist (legacy from template)
- **Button customizations**: shadcn/ui button component has custom variants—check inline comments before modifying
- **Port 5010**: Always dev server port, never use default 5173
- **docs/ folder**: Committed to git for GitHub Pages deployment (not in .gitignore)

## Documentation Policy

When generating markdown documentation files (analysis, summaries, reports, etc.):
- **Output directory**: Always place generated `.md` files in `/documentation/copilot/session-{date}/`
- **Date format**: Use ISO date format `YYYY-MM-DD` (e.g., `session-2025-12-14`)
- **File naming**: Use descriptive kebab-case names (e.g., `component-analysis.md`, `refactoring-plan.md`)
- **Existing docs**: Project documentation like README.md should remain at their current locations
- **Session isolation**: Each AI session should create a new dated subfolder to keep work organized
