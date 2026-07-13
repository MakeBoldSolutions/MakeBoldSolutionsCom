# Make Bold Solutions

The marketing website for Make Bold Solutions — a fractional CFO firm led by Lesley Hazleton, CPA, based in Wichita, Kansas.

The site is a Node.js static site generator: `build.js` reads content from `content.json` and writes flat HTML files to `docs/`. There is no backend, no database, and no client-side framework — just generated HTML with inline CSS and JavaScript.

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the dev server** (builds once, serves `docs/`, rebuilds on changes to `build.js` or `content.json`)
   ```bash
   npm run dev
   ```

   The site will be available at: http://localhost:5000

3. **Build for production**
   ```bash
   npm run build
   ```

   Output is written to `docs/`.

4. **Serve the built site without watching for changes**
   ```bash
   npm run serve
   ```

## Available Scripts

- `npm run clean` - Remove the generated `docs/` directory (build.js never clears stale files on its own, so this catches orphaned output from removed pages/assets)
- `npm run lint` - Lint `build.js`, `dev.js`, `serve.js`, and `test/` with ESLint
- `npm test` - Run the build against a smoke-test suite (Node's built-in test runner): verifies every page builds, required Azure/SEO files are copied, and internal links resolve to real files
- `npm run build` - Run the static site generator (`build.js`) and write output to `docs/`
- `npm run dev` - Build, serve `docs/` locally, and rebuild automatically when `build.js` or `content.json` changes
- `npm run serve` - Serve the existing `docs/` output without rebuilding

## Project Structure

```
MakeBoldSolutionsCom/
├── build.js              # Static site generator — the entire build pipeline
├── content.json          # All site content: copy, nav links, page sections, contact info
├── dev.js                # Local dev server with rebuild-on-change
├── serve.js              # Plain static file server for docs/
├── static/                # Source files copied into docs/ on every build
│   ├── staticwebapp.config.json  # Azure Static Web Apps routing, headers, caching
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.png / favicon.svg
│   └── .well-known/security.txt
├── attached_assets/       # Logo files, vCards, and contact photos used during build
├── documentation/         # Brand guide, logo source files, project docs
└── docs/                  # Build output (committed to git for Azure Static Web Apps)
```

## Pages

- **Home** (`index.html`)
- **Services** (`services-cfo.html`) — Fractional CFO service details
- **About / Our Firm** (`about.html`)
- **CFO of the Year** (`cfo-of-the-year.html`) — Award recognition page
- **Contact** (`contact.html`)
- **Digital business cards** (`markhazleton/card/`, `lesleyhazleton/card/`) — vCard-enabled contact cards

## Editing Content

Site copy, navigation, and page sections live in `content.json`. Edit that file and run `npm run build` to regenerate `docs/`.

## Deployment

The site deploys to Azure Static Web Apps via [.github/workflows/azure-static-web-apps-lemon-plant-08b5fed10.yml](.github/workflows/azure-static-web-apps-lemon-plant-08b5fed10.yml), which triggers on every push to `main`. It uploads the pre-built `docs/` folder as-is (`skip_app_build: true`, `app_location: "docs"`) — there is no build step in CI, so `docs/` must be regenerated and committed locally before pushing. The custom domain `makeboldsolutions.com` is configured in the Azure Static Web Apps portal (Custom domains blade), not via a repo file. Routing, security headers, and caching rules live in [static/staticwebapp.config.json](static/staticwebapp.config.json), which `build.js` copies into `docs/` on every build. After making changes:

```bash
npm run build
git add docs/ content.json build.js
git commit -m "Update site content"
git push origin main
```

## License

MIT
