# Make Bold Solutions Copilot Instructions

## Project Overview
Static marketing website for Make Bold Solutions, a fractional CFO firm. Built as a Node.js static site generator — no backend, no database, no client-side framework. `build.js` reads `content.json` and writes flat HTML files to `docs/`.

## Architecture & Structure

### Key Design Decisions
- **Single build script**: [build.js](../build.js) is the entire pipeline — it reads `content.json`, generates HTML with inline CSS/JS, and writes to `docs/`.
- **Content model**: All site copy, navigation, and page sections live in [content.json](../content.json). To change text or add a page, edit this file and rebuild.
- **No dependencies beyond Node core modules** (`fs`, `path`, `url`) plus the `qrcode` package used to generate vCard QR codes on the digital business card pages.

### Directory Layout
```
MakeBoldSolutionsCom/
├── build.js               # Static site generator — the entire build pipeline
├── content.json           # All site content
├── dev.js                 # Local dev server with rebuild-on-change
├── serve.js               # Plain static file server for docs/
├── static/                 # Files copied verbatim into docs/ on every build
│   ├── staticwebapp.config.json, robots.txt, sitemap.xml, favicon.*, .well-known/
├── attached_assets/        # Logo files, vCards, contact photos used during build
├── documentation/          # Brand guide, logo source files
└── docs/                   # Build output, committed to git for Azure Static Web Apps
```

## Development Workflows

```bash
npm install        # Install dependencies (just qrcode)
npm run dev         # Build, serve docs/ on http://localhost:5000, rebuild on content/build.js change
npm run build       # Run build.js, write output to docs/
npm run serve       # Serve existing docs/ without rebuilding
```

### Build & Deployment
- Build output goes to `docs/`, which is committed to git.
- Azure Static Web Apps deploys on push to `main` via `.github/workflows/azure-static-web-apps-*.yml`, which uploads `docs/` as a pre-built artifact (`skip_app_build: true`) — there is no build step in CI, so `docs/` must be committed already up to date. Custom domain `makeboldsolutions.com` is configured in the Azure portal, not a repo file.
- `build.js` copies `static/staticwebapp.config.json`, `static/robots.txt`, `static/sitemap.xml`, favicons, and `static/.well-known/security.txt` into `docs/` on every run — edit the source files in `static/`, not the generated copies in `docs/`.

## Code Conventions
- Pages are built by individual `build*()` functions in `build.js` (e.g. `buildHome`, `buildAbout`, `buildContact`) and registered in the `pages` array near the bottom of the file.
- HTML, CSS, and SVG icons are generated as template strings directly in `build.js` — there is no separate templating engine or CSS file.
- Person/contact data for the digital business cards lives in `content.json` under the `cards` key; `build.js` generates one page per entry via `buildCard(person)`.

## Documentation Policy

When generating markdown documentation files (analysis, summaries, reports, etc.):
- **Output directory**: Always place generated `.md` files in `/documentation/copilot/session-{date}/`
- **Date format**: Use ISO date format `YYYY-MM-DD` (e.g., `session-2026-06-28`)
- **File naming**: Use descriptive kebab-case names (e.g., `component-analysis.md`, `refactoring-plan.md`)
- **Existing docs**: Project documentation like README.md should remain at their current locations
- **Session isolation**: Each AI session should create a new dated subfolder to keep work organized
