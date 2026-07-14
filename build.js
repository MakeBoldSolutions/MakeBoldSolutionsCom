import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __dirname = dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(readFileSync(join(__dirname, 'content.json'), 'utf-8'));
const docsDir = join(__dirname, 'docs');

// Ensure docs directory exists
mkdirSync(docsDir, { recursive: true });

// Copy logo assets
const assetsDir = join(__dirname, 'attached_assets');
copyFileSync(
  join(assetsDir, 'Logo_1782261672176.svg'),
  join(docsDir, 'logo-nav.svg')
);
copyFileSync(
  join(assetsDir, 'LogoDesign-FileExport-Guide-RGB-DIGITALFILES_Vertical_Logo_Ful_1771122562725.png'),
  join(docsDir, 'logo-nav.png')
);
copyFileSync(
  join(assetsDir, 'LogoDesign-FileExport-Guide-RGB-DIGITALFILES_Vertical_Logo_B&W_1771122562725.png'),
  join(docsDir, 'logo-footer.png')
);

// Copy the brand intro video used as the looping hero on the fractional-cfo page
copyFileSync(
  join(assetsDir, 'animation', 'Make Bold Intro.mp4'),
  join(docsDir, content.servicePages.find(p => p.slug === 'fractional-cfo').video.src)
);

// Copy the project-engagements intro video used as the looping hero on the
// projects page, once it has been exported and dropped into attached_assets.
const projectsVideoSrc = join(assetsDir, 'Projects Animation.mp4');
if (existsSync(projectsVideoSrc)) {
  copyFileSync(projectsVideoSrc, join(docsDir, content.servicePages.find(p => p.slug === 'projects').video.src));
}

// Copy favicon
const staticDir = join(__dirname, 'static');
copyFileSync(join(staticDir, 'favicon.png'), join(docsDir, 'favicon.png'));
copyFileSync(join(staticDir, 'favicon.svg'), join(docsDir, 'favicon.svg'));

// Copy crawler rules and security contact
copyFileSync(join(staticDir, 'robots.txt'), join(docsDir, 'robots.txt'));
copyFileSync(join(staticDir, 'sitemap.xml'), join(docsDir, 'sitemap.xml'));
// Copy Azure Static Web Apps config (routing, redirects, MIME types, security headers)
copyFileSync(join(staticDir, 'staticwebapp.config.json'), join(docsDir, 'staticwebapp.config.json'));
// Copy GitHub Pages config: CNAME sets the custom domain, .nojekyll serves files as-is
copyFileSync(join(staticDir, 'CNAME'), join(docsDir, 'CNAME'));
copyFileSync(join(staticDir, '.nojekyll'), join(docsDir, '.nojekyll'));
const wellKnownDir = join(docsDir, '.well-known');
mkdirSync(wellKnownDir, { recursive: true });
copyFileSync(join(staticDir, '.well-known', 'security.txt'), join(wellKnownDir, 'security.txt'));

// Copy digital business card contact assets
const contactsSrcDir = join(assetsDir, 'contacts');
const contactsDistDir = join(docsDir, 'contacts');
mkdirSync(contactsDistDir, { recursive: true });
for (const file of ['mark-hazleton.jpg', 'lesley-hazleton.jpg', 'mark-hazleton.vcf', 'lesley-hazleton.vcf']) {
  copyFileSync(join(contactsSrcDir, file), join(contactsDistDir, file));
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const icons = {
  'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
  'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  'hand-heart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/></svg>',
  'phone': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  'award': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  'arrow-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
  'arrow-right': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  'chevron-down': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  'linkedin': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  'menu': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  'book': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  'zap': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  'x': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  'external-link': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
};

function icon(name, size = 24) {
  const svg = icons[name] || '';
  if (size !== 24) {
    return svg.replace(/width="24"/g, `width="${size}"`).replace(/height="24"/g, `height="${size}"`);
  }
  return svg;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
/* Reset & Base */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  font-family: 'Inter Tight', sans-serif;
  background: #F8F6F2;
  color: #1E1E1E;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
h1, h2, h3, h4, h5, h6 {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

/* Colors */
:root {
  --primary: #982407;
  --primary-light: rgba(152, 36, 7, 0.1);
  --primary-border: rgba(152, 36, 7, 0.2);
  --secondary: #C6620C;
  --bg: #F8F6F2;
  --fg: #1E1E1E;
  --muted: #EDEAE5;
  --muted-fg: #666666;
  --border: #DDD9D4;
  --dark: #1E1E1E;
  --white: #ffffff;
}

/* Container */
.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}
@media (min-width: 640px) { .container { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .container { padding: 0 2rem; } }

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--primary);
  color: var(--bg);
  padding: 0.625rem 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
  min-height: 44px;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  color: var(--fg);
  padding: 0.625rem 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
}
.btn-outline:hover { background: var(--primary); color: var(--bg); border-color: var(--primary); }

.btn-outline-white {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  color: var(--white);
  padding: 0.625rem 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
}
.btn-outline-white:hover { background: var(--white); color: var(--dark); }

.btn-white {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--white);
  color: var(--dark);
  padding: 0.625rem 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
}
.btn-white:hover { opacity: 0.9; }

.btn-large { padding: 1rem 2.5rem; font-size: 1rem; }

/* Navigation */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(248, 246, 242, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(217, 212, 207, 0.4);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nav-logo img { height: 2.5rem; width: auto; }
.nav-logo-text {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--fg);
  letter-spacing: -0.01em;
}
.nav-logo-text b { font-weight: 900; }
.nav-links { display: none; align-items: center; gap: 2rem; }
.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(31, 31, 31, 0.8);
  transition: color 0.2s;
  padding: 0.5rem 0;
}
.nav-link:hover { color: var(--primary); }
.nav-link.active { color: var(--primary); font-weight: 700; }

/* Desktop dropdown */
.nav-item { position: relative; }
.nav-item .nav-link { display: inline-flex; align-items: center; gap: 0.3rem; }
.nav-caret { display: inline-flex; transition: transform 0.2s; }
.nav-item:hover .nav-caret, .nav-item:focus-within .nav-caret { transform: rotate(180deg); }
.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 17rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-top: 3px solid var(--primary);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  padding: 0.5rem 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  z-index: 60;
}
.nav-item:hover .nav-dropdown, .nav-item:focus-within .nav-dropdown {
  opacity: 1;
  visibility: visible;
}
.nav-dropdown-link {
  display: block;
  padding: 0.75rem 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(31, 31, 31, 0.8);
  white-space: nowrap;
  transition: color 0.15s, background 0.15s;
}
.nav-dropdown-link:hover { color: var(--primary); background: rgba(151,27,12,0.05); }

/* Desktop nav CTA button */
.nav-cta {
  padding: 0.625rem 1.5rem;
  background: var(--primary);
  color: var(--white);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: opacity 0.2s;
}
.nav-cta:hover { opacity: 0.9; }

/* Mobile menu toggle button */
.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: 1px solid var(--border);
  cursor: pointer;
  color: var(--fg);
  flex-shrink: 0;
}
.mobile-menu-toggle:hover { border-color: var(--primary); color: var(--primary); }

/* Full-width mobile nav panel — sits below the nav bar */
.mobile-nav-panel {
  display: none;
  background: var(--dark);
  border-top: 3px solid var(--primary);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.nav-open .mobile-nav-panel { display: block; }
.mobile-nav-panel .container { padding-top: 0; padding-bottom: 0; }
.mobile-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1.1rem 0;
  color: rgba(255,255,255,0.85);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-height: 56px;
  transition: color 0.15s;
}
.mobile-nav-link:last-child { border-bottom: none; }
.mobile-nav-link:hover { color: var(--primary); }
.mobile-nav-link.active { color: var(--primary); }
.mobile-nav-sublink {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.75rem 0 0.75rem 1.5rem;
  color: rgba(255,255,255,0.65);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  letter-spacing: 0.04em;
  transition: color 0.15s;
}
.mobile-nav-sublink:hover { color: var(--primary); }
.mobile-nav-cta {
  display: block;
  margin: 1.25rem 0;
  padding: 0.875rem 1.5rem;
  background: var(--primary);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  min-height: 48px;
  line-height: 1.2;
}
.mobile-nav-cta:hover { opacity: 0.9; }

@media (min-width: 768px) {
  .nav-links { display: flex; }
  .mobile-menu-toggle { display: none; }
  .mobile-nav-panel { display: none !important; }
}

/* Grid Pattern Background */
.bg-grid {
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
}

/* Sections — mobile-first padding */
.section { padding: 2.5rem 0; }
.section-sm { padding: 1.25rem 0; }
@media (min-width: 768px) {
  .section { padding: 4rem 0; }
  .section-sm { padding: 2rem 0; }
}
@media (min-width: 1024px) { .section { padding: 5rem 0; } }
.section-dark { background: var(--dark); color: var(--white); }
.section-white { background: var(--white); }
.section-muted { background: var(--muted); }
.section-primary { background: var(--primary); color: var(--white); }

/* Page header (dark banner at top of inner pages) */
.page-header { padding: 2.5rem 0; }
@media (min-width: 768px) { .page-header { padding: 3.5rem 0; } }
@media (min-width: 1024px) { .page-header { padding: 5rem 0; } }

/* Hero section */
.hero-section { padding: 2.5rem 0; }
@media (min-width: 768px) { .hero-section { padding: 4rem 0; } }
@media (min-width: 1024px) { .hero-section { padding: 5rem 0; } }

/* Responsive grid gap for two-col layouts that stack on mobile */
.gap-stack { gap: 2rem; }
@media (min-width: 1024px) { .gap-stack { gap: 4rem; } }

/* Text */
.text-primary { color: var(--primary); }
.text-muted { color: var(--muted-fg); }
.text-white-70 { color: rgba(255,255,255,0.7); }
.text-white-80 { color: rgba(255,255,255,0.8); }
.text-center { text-align: center; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
.text-4xl { font-size: 2.25rem; }
.text-5xl { font-size: 3rem; }
.font-heading { font-family: 'Be Vietnam Pro', sans-serif; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.uppercase { text-transform: uppercase; }
.tracking-widest { letter-spacing: 0.1em; }
.tracking-wider { letter-spacing: 0.05em; }
.leading-tight { line-height: 1.2; }
.leading-relaxed { line-height: 1.75; }
.max-w-2xl { max-width: 42rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-4xl { max-width: 56rem; }
.max-w-5xl { max-width: 64rem; }
.max-w-md { max-width: 28rem; }
.max-w-xs { max-width: 20rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-10 { margin-bottom: 2.5rem; }
.mb-12 { margin-bottom: 3rem; }
.mb-16 { margin-bottom: 4rem; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-12 { margin-top: 3rem; }
.mt-20 { margin-top: 5rem; }

/* Grid & Flex */
.grid { display: grid; gap: 2rem; }
.grid-2 { grid-template-columns: 1fr; }
.grid-3 { grid-template-columns: 1fr; }
.grid-4 { grid-template-columns: 1fr; }
.grid-12 { grid-template-columns: 1fr; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.items-start { align-items: start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-10 { gap: 2.5rem; }
.gap-12 { gap: 3rem; }
.gap-16 { gap: 4rem; }
.flex-shrink-0 { flex-shrink: 0; }
.flex-grow { flex-grow: 1; }
.flex-wrap { flex-wrap: wrap; }

@media (min-width: 640px) {
  .sm-flex-row { flex-direction: row; }
}
@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-12 { grid-template-columns: repeat(12, 1fr); }
  .md-flex-row { flex-direction: row; }
  .md-col-span-8 { grid-column: span 8; }
  .md-col-span-4 { grid-column: span 4; }
}
@media (min-width: 1024px) {
  .grid-2-lg { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  .lg-text-5xl { font-size: 3rem; }
  .lg-text-6xl { font-size: 3.75rem; }
  .lg-block { display: block; }
  .lg-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); }
}

/* Cards */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 2rem;
  transition: box-shadow 0.3s, transform 0.3s;
}
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.card-lift:hover { transform: translateY(-4px); }

/* Service Card */
.service-card {
  background: var(--white);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 2rem;
  transition: box-shadow 0.3s, transform 0.3s;
  display: flex;
  flex-direction: column;
}
.service-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-4px); }
.service-card .icon-box {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
}
.service-card h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
.service-card p { color: var(--muted-fg); margin-bottom: 1.5rem; flex-grow: 1; }
.service-card .features { margin-bottom: 1.5rem; }
.service-card .feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--fg);
}
.service-card .feature::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
}
.service-card .card-link {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: auto;
}

/* Icon boxes */
.icon-box {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}
.icon-box-lg {
  width: 3rem;
  height: 3rem;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-box-lg svg { color: var(--primary); }

/* Why us reason */
.reason { display: flex; gap: 1.5rem; }
.reason + .reason { margin-top: 2rem; }
.reason h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
.reason p { color: rgba(255,255,255,0.7); }

/* Step numbers */
.step-number {
  width: 3rem;
  height: 3rem;
  background: var(--primary);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
}

/* Case study card */
.case-study {
  background: var(--white);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s;
}
.case-study:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.case-study::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
}
@media (min-width: 1024px) { .case-study { padding: 2.5rem; } }
.badge {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-muted {
  display: inline-block;
  color: var(--muted-fg);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.outcome-box {
  background: rgba(30,30,30,0.05);
  padding: 1.5rem;
  border-left: 4px solid var(--dark);
}
.metrics-panel {
  background: rgba(229, 225, 221, 0.3);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}
.metric { text-align: center; }
.metric .value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--primary);
  font-family: 'Playfair Display', Georgia, serif;
  margin-bottom: 0.25rem;
}
.metric .label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-fg);
}

/* About */
.leader-avatar {
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: top center;
  border: 4px solid var(--bg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  flex-shrink: 0;
}
.avatar {
  width: 8rem;
  height: 8rem;
  background: var(--dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.25rem;
  font-weight: 700;
  flex-shrink: 0;
}
.award-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
}
.award-badge svg { color: var(--primary); flex-shrink: 0; }
.accomplishment {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--muted-fg);
}
.accomplishment::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

/* CFO of the Year */
.award-info {
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  padding: 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.award-info svg { flex-shrink: 0; color: var(--primary); margin-top: 0.25rem; }
.prose p { margin-bottom: 1rem; color: var(--muted-fg); font-size: 1.125rem; line-height: 1.75; }
.prose h3 { margin-bottom: 0.75rem; font-size: 1.25rem; }
.quote-box {
  background: rgba(229, 225, 221, 0.5);
  padding: 1.5rem;
}
.quote-box + .quote-box { margin-top: 1.5rem; }

/* Contact */
.contact-split { display: grid; grid-template-columns: 1fr; min-height: auto; }
@media (min-width: 1024px) { .contact-split { grid-template-columns: 1fr 1fr; } }
.contact-left {
  background: var(--dark);
  color: var(--white);
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 1024px) { .contact-left { padding: 6rem; } }
.contact-right {
  background: var(--white);
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 1024px) { .contact-right { padding: 6rem; } }
.contact-info { display: flex; align-items: flex-start; gap: 1rem; }
.contact-info + .contact-info { margin-top: 2rem; }
.contact-info svg { color: var(--primary); flex-shrink: 0; margin-top: 0.25rem; }
.contact-info h3 { font-weight: 700; font-size: 1.125rem; margin-bottom: 0.25rem; }
.contact-info p { color: rgba(255,255,255,0.7); }

/* Forms */
.form-group { margin-bottom: 1.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
.form-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #ccc;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  background: var(--white);
  color: var(--fg);
  min-height: 44px;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}
.form-textarea { min-height: 120px; resize: vertical; }
.form-submit {
  width: 100%;
  min-height: 48px;
}

/* Spark Section */
.spark-section {
  background: #0D0D0D;
  color: var(--white);
  position: relative;
  overflow: hidden;
}
.spark-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(152,36,7,0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(152,36,7,0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}
.spark-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.9rem;
  margin-bottom: 1.5rem;
  background: rgba(152,36,7,0.15);
  border: 1px solid rgba(152,36,7,0.4);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--primary);
}
.spark-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 2rem;
  transition: border-color 0.2s, background 0.2s;
}
.spark-card:hover {
  background: rgba(152,36,7,0.08);
  border-color: rgba(152,36,7,0.3);
}
.spark-card svg { color: var(--primary); margin-bottom: 1rem; }
.spark-card h3 { color: var(--white); margin-bottom: 0.75rem; font-size: 1.1rem; }
.spark-card p { color: rgba(255,255,255,0.55); font-size: 0.9rem; line-height: 1.7; }
.spark-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.2s, transform 0.2s;
  min-height: 44px;
}
.spark-cta:hover { opacity: 0.9; transform: translateY(-1px); }

/* Footer */
.footer {
  background: var(--dark);
  color: rgba(245, 241, 237, 0.7);
  padding-top: 4rem;
  padding-bottom: 2rem;
  border-top: 4px solid var(--primary);
}
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
.footer h4 {
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}
.footer-link {
  display: block;
  font-size: 0.875rem;
  padding: 0.375rem 0;
  color: rgba(245, 241, 237, 0.7);
  transition: color 0.2s;
}
.footer-link:hover { color: var(--primary); }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(245, 241, 237, 0.5);
}
@media (min-width: 768px) { .footer-bottom { flex-direction: row; justify-content: space-between; } }
.footer-bottom a { color: rgba(245, 241, 237, 0.5); transition: color 0.2s; }
.footer-bottom a:hover { color: var(--white); }
.social-icon {
  display: inline-flex;
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  color: rgba(245, 241, 237, 0.7);
  transition: background 0.2s;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}
.social-icon:hover { background: var(--primary); }

/* Skew accent */
.header-accent {
  position: relative;
  overflow: hidden;
}
.header-accent::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 33%;
  background: rgba(151, 27, 12, 0.1);
  transform: skewX(-12deg) translateX(5rem);
}

/* Hero image container */
.hero-image-wrap {
  position: relative;
  display: block;
  margin-top: 2rem;
}
@media (min-width: 1024px) { .hero-image-wrap { margin-top: 0; } }
.hero-image-wrap::before {
  content: '';
  position: absolute;
  inset: -1rem;
  border: 2px solid rgba(151, 27, 12, 0.3);
  z-index: 0;
}
.hero-image-wrap img {
  position: relative;
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  filter: grayscale(20%) contrast(125%);
}

/* Quote overlay */
.quote-overlay {
  position: relative;
  background: var(--primary);
  padding: 1.25rem 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: block;
}
@media (min-width: 1024px) {
  .quote-overlay {
    position: absolute;
    bottom: -2rem;
    left: -2rem;
    margin-top: 0;
    padding: 2rem;
    max-width: 20rem;
  }
}
.quote-overlay p {
  color: var(--white);
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 1.5rem;
  font-style: italic;
  line-height: 1.3;
}

/* Proof bar */
.proof-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  text-align: center;
}
@media (min-width: 768px) { .proof-bar { grid-template-columns: repeat(4, 1fr); } }

/* 404 */
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
}

/* Responsive text */
@media (min-width: 1024px) {
  .lg-text-5xl { font-size: 3rem; }
  .lg-text-6xl { font-size: 3.75rem; }
}

/* Print */
@media print {
  .nav, .footer, .mobile-nav-panel { display: none; }
  body { background: white; }
}

/* Digital business card */
.card-page { min-height: 100vh; display: flex; flex-direction: column; }
.card-brand { background: var(--primary); padding: 2rem 1.5rem 4rem; display: flex; justify-content: center; }
.card-brand-logo { height: 2.25rem; width: auto; filter: brightness(0) invert(1); }
.card-content {
  flex: 1; margin: -2.5rem auto 0; padding: 0 1.5rem 2.5rem;
  display: flex; flex-direction: column; align-items: center;
  max-width: 28rem; width: 100%;
}
.card-avatar {
  width: 9rem; height: 9rem; border-radius: 50%; object-fit: cover;
  border: 4px solid var(--bg); box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.card-name { margin-top: 1.25rem; font-size: 1.75rem; color: var(--primary); text-align: center; }
.card-role { color: var(--muted-fg); font-weight: 600; text-align: center; margin-top: 0.25rem; }
.card-org { color: var(--muted-fg); font-size: 0.875rem; text-align: center; opacity: 0.8; }
.card-tagline { margin-top: 1rem; text-align: center; line-height: 1.6; color: var(--fg); opacity: 0.85; }
.card-hint { margin-top: 0.5rem; text-align: center; font-size: 0.8125rem; color: var(--muted-fg); font-style: italic; }
.card-actions { margin-top: 2rem; width: 100%; display: flex; flex-direction: column; gap: 0.75rem; }
.card-cta-primary {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; min-height: 3.25rem; background: var(--primary); color: var(--bg);
  font-weight: 700; font-size: 1.0625rem; border: none; border-radius: 0.75rem;
  box-shadow: 0 8px 20px rgba(152,36,7,0.3); transition: transform .15s, box-shadow .15s; cursor: pointer;
}
.card-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(152,36,7,0.35); }
.card-cta-secondary, .card-cta-tertiary {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; min-height: 2.875rem; font-weight: 600; font-size: 0.9375rem;
  border-radius: 0.75rem; border: 1px solid var(--border); background: var(--white);
  color: var(--fg); cursor: pointer; transition: border-color .15s, color .15s;
}
.card-cta-secondary:hover, .card-cta-tertiary:hover { border-color: var(--primary); color: var(--primary); }
.card-qr-box {
  margin-top: 2rem; background: var(--white); border: 1px solid var(--border); border-radius: 1rem;
  padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
}
.card-qr-box svg { width: 160px; height: 160px; }
.card-qr-caption { font-size: 0.75rem; color: var(--muted-fg); text-transform: uppercase; letter-spacing: 0.05em; }
.card-info {
  margin-top: 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.375rem;
  font-size: 0.9375rem; color: var(--muted-fg); text-align: center;
}
.card-info a:hover { color: var(--primary); }
.card-spark-link {
  margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 0.375rem;
  font-size: 0.8125rem; font-weight: 600; color: var(--secondary);
}
.card-spark-link:hover { color: var(--primary); }
.card-footer { text-align: center; font-size: 0.75rem; color: var(--muted-fg); opacity: 0.7; padding: 1.5rem 0; }

/* Service page video hero */
.deck { max-width: 64rem; margin: 0 auto 4rem; padding: 0 1rem; }
.intro-video-frame { position: relative; overflow: hidden; border-radius: 1.25rem; box-shadow: 0 24px 60px rgba(30,30,30,0.18); background: #1E1E1E; aspect-ratio: 16 / 9; }
.intro-video-frame video { display: block; width: 100%; height: 100%; object-fit: cover; }
.intro-video-caption { text-align: center; margin-top: 0.875rem; font-size: 0.8125rem; color: var(--muted-fg); font-style: italic; }
`;

// Write CSS once as a shared external file so browsers cache it across page
// navigations instead of re-downloading it inlined in every HTML page.
writeFileSync(join(docsDir, 'styles.css'), css.trim() + '\n', 'utf-8');

// ─── Shared HTML Builders ────────────────────────────────────────────────────

function htmlHead(title, description, slug = '', options = {}) {
  const metaDesc = description || content.site.description;
  const previewImageUrl = `${content.site.url}/logo-nav.png`;
  const canonicalUrl = slug
    ? `${content.site.url}/${slug}`
    : content.site.url;
  const pageTitle = `${title} | ${content.site.title}`;
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Make Bold Solutions",
    "description": "Fractional CFO and strategic financial leadership for small businesses, sole proprietors, and nonprofits in Wichita, Kansas.",
    "url": content.site.url,
    "email": content.site.email,
    "sameAs": [content.site.linkedinCompany],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Wichita",
      "addressRegion": "KS",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "City", "name": "Wichita" },
      { "@type": "State", "name": "Kansas" }
    ],
    "founder": [
      {
        "@type": "Person",
        "name": "Lesley Hazleton, CPA",
        "jobTitle": "Co-Founder & Managing Partner",
        "award": "2023 Wichita Business Journal CFO of the Year",
        "sameAs": ["https://www.linkedin.com/in/lesleyhazleton/"]
      },
      {
        "@type": "Person",
        "name": "Mark Hazleton",
        "jobTitle": "Co-Founder & CTO",
        "sameAs": ["https://www.linkedin.com/in/markhazleton/"]
      }
    ],
    "knowsAbout": ["Fractional CFO", "Financial Leadership", "Tax Planning", "Corporate Controller", "Nonprofit Finance"]
  });
  const robotsMeta = options.robots
    ? `  <meta name="robots" content="${escapeAttr(options.robots)}">\n`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5">
  <meta name="description" content="${escapeAttr(metaDesc)}">
${robotsMeta}  <link rel="canonical" href="${escapeAttr(canonicalUrl)}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Make Bold Solutions">
  <meta property="og:title" content="${escapeAttr(pageTitle)}">
  <meta property="og:description" content="${escapeAttr(metaDesc)}">
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}">
  <meta property="og:image" content="${escapeAttr(previewImageUrl)}">
  <meta property="og:image:alt" content="Make Bold Solutions logo">
  <meta property="og:locale" content="en_US">

  <!-- Twitter/X -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
  <meta name="twitter:description" content="${escapeAttr(metaDesc)}">
  <meta name="twitter:image" content="${escapeAttr(previewImageUrl)}">

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">${schemaJson}</script>

  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="apple-touch-icon" href="favicon.png">
  <meta name="theme-color" content="#982407">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Inter+Tight:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function navigation(activePage) {
  const isLinkActive = link => {
    if (link.href.split('#')[0] === activePage) return true;
    return (link.children || []).some(child => child.href.split('#')[0] === activePage);
  };

  const navLinks = content.nav.links.filter(link => !link.primary).map(link => {
    const activeClass = isLinkActive(link) ? ' active' : '';
    if (!link.children) {
      return `<a href="${link.href}" class="nav-link${activeClass}">${escapeHtml(link.label)}</a>`;
    }
    const dropdownLinks = link.children.map(child =>
      `<a href="${child.href}" class="nav-dropdown-link">${escapeHtml(child.label)}</a>`
    ).join('\n                ');
    return `<div class="nav-item">
              <a href="${link.href}" class="nav-link${activeClass}">${escapeHtml(link.label)} <span class="nav-caret">${icon('chevron-down', 14)}</span></a>
              <div class="nav-dropdown">
                ${dropdownLinks}
              </div>
            </div>`;
  }).join('\n            ');

  const mobileLinks = content.nav.links.filter(link => !link.primary).map(link => {
    const activeClass = isLinkActive(link) ? ' active' : '';
    const parent = `<a href="${link.href}" class="mobile-nav-link${activeClass}">${escapeHtml(link.label)} ${icon('arrow-right', 16)}</a>`;
    if (!link.children) return parent;
    const subLinks = link.children.map(child =>
      `<a href="${child.href}" class="mobile-nav-sublink">${escapeHtml(child.label)}</a>`
    ).join('\n              ');
    return `${parent}\n              ${subLinks}`;
  }).join('\n              ');

  return `
  <nav class="nav" id="site-nav">
    <div class="container">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">
          <img src="logo-nav.svg" alt="Make Bold Solutions" loading="eager" style="height:3.5rem;width:auto">
        </a>
        <div class="nav-links">
            ${navLinks}
            <a href="contact.html" class="nav-cta">Get in Touch</a>
        </div>
        <button class="mobile-menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav-panel" onclick="
          var nav = document.getElementById('site-nav');
          var open = nav.classList.toggle('nav-open');
          this.setAttribute('aria-expanded', open);
          this.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
          this.innerHTML = open ? '${icon('x').replace(/"/g, '&quot;')}' : '${icon('menu').replace(/"/g, '&quot;')}';
        ">${icon('menu')}</button>
      </div>
    </div>
    <div class="mobile-nav-panel" id="mobile-nav-panel" aria-hidden="true">
      <div class="container">
        ${mobileLinks}
        <a href="contact.html" class="mobile-nav-cta">Get in Touch &rarr;</a>
      </div>
    </div>
  </nav>`;
}

function footer() {
  const year = new Date().getFullYear();
  const serviceLinks = content.footer.services.map(s =>
    `<a href="${s.href}" class="footer-link">${escapeHtml(s.label)}</a>`
  ).join('\n            ');
  const companyLinks = content.footer.company.map(c =>
    `<a href="${c.href}" class="footer-link">${escapeHtml(c.label)}</a>`
  ).join('\n            ');

  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="nav-logo" style="margin-bottom:1rem">
            <img src="logo-nav.svg" alt="Make Bold Solutions" style="height:3rem;width:auto;filter:brightness(0) invert(1)" loading="lazy">
          </div>
          <p style="font-size:0.875rem;max-width:20rem;line-height:1.6">${escapeHtml(content.footer.tagline)}</p>
        </div>
        <div>
          <h4>Services</h4>
            ${serviceLinks}
        </div>
        <div>
          <h4>Company</h4>
            ${companyLinks}
        </div>
        <div>
          <h4>Connect</h4>
          <div style="display:flex;gap:1rem;margin-bottom:1.5rem">
            <a href="${content.site.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">${icon('linkedin', 20)}</a>
            <a href="${content.site.linkedinCompany}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Make Bold Solutions on LinkedIn">${icon('briefcase', 20)}</a>
          </div>
          <p class="text-xs" style="color:rgba(245,241,237,0.5);margin-bottom:1.5rem">${escapeHtml(content.site.location)}</p>
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:1.25rem">
            <p style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:var(--primary);margin-bottom:0.5rem">Our Technical Division</p>
            <a href="${escapeAttr(content.footer.spark.href)}" target="_blank" rel="noopener noreferrer" class="footer-link" style="color:rgba(245,241,237,0.9);font-weight:600;display:inline-flex;align-items:center;gap:0.375rem">${icon('zap', 14)}&nbsp;${escapeHtml(content.footer.spark.label)}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${escapeHtml(content.site.copyright)}. All rights reserved.</p>
        <p>Wichita, Kansas &mdash; Serving businesses across the region</p>
      </div>
    </div>
  </footer>`;
}

function closePage() {
  return `\n</body>\n</html>`;
}

// ─── Page Builders ───────────────────────────────────────────────────────────

function buildHome() {
  const h = content.home;
  const serviceCards = h.services.cards.map(card => `
          <div class="service-card">
            <div class="icon-box" style="width:3.5rem;height:3.5rem;margin-bottom:1.5rem">${icon(card.icon, 40)}</div>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.description)}</p>
            <div class="features">
              ${card.features.map(f => `<div class="feature">${escapeHtml(f)}</div>`).join('\n              ')}
            </div>
            <a href="${card.href}" class="card-link">Explore Service &rarr;</a>
          </div>`).join('');

  const reasons = h.whyUs.reasons.map(r => `
              <div class="reason">
                <div class="flex-shrink-0">
                  <div class="icon-box-lg">${icon(r.icon)}</div>
                </div>
                <div>
                  <h3>${escapeHtml(r.title)}</h3>
                  <p>${escapeHtml(r.description)}</p>
                </div>
              </div>`).join('');

  const entryOffers = h.entryOffers.offers.map(o => `
            <div class="card">
              <div class="icon-box" style="margin-bottom:1rem">${icon(o.icon, 20)}</div>
              <h3 style="font-weight:700;margin-bottom:0.5rem">${escapeHtml(o.title)}</h3>
              <p class="text-sm text-muted">${escapeHtml(o.description)}</p>
            </div>`).join('');

  const proofItems = h.proofBar.map(p => `
            <div>
              <div class="text-3xl font-heading font-bold${p.highlight ? ' text-primary' : ''}">${escapeHtml(p.value)}</div>
              <div class="text-xs font-bold uppercase tracking-widest text-muted">${escapeHtml(p.label)}</div>
            </div>`).join('');

  return htmlHead(
    'Fractional CFO Wichita, Kansas',
    'Make Bold Solutions provides fractional CFO services and strategic financial leadership to small businesses, sole proprietors, and nonprofits in Wichita, Kansas. Award-winning CPA, big-firm expertise.',
    ''
  ) + navigation('index.html') + `

  <!-- Hero -->
  <section class="section-dark hero-section">
    <div class="container" style="position:relative;z-index:1">
      <div class="grid grid-2-lg gap-stack" style="align-items:center">
        <div>
          <div style="display:inline-block;padding:0.25rem 0.75rem;margin-bottom:1.5rem;border:1px solid rgba(151,27,12,0.5);background:rgba(151,27,12,0.1);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${escapeHtml(h.hero.badge)}</div>
          <h1 class="text-4xl lg-text-6xl font-heading font-bold leading-tight mb-6">
            ${escapeHtml(h.hero.headingLine1)}<br><span class="text-primary">${escapeHtml(h.hero.headingLine2)}</span>
          </h1>
          <p class="text-lg text-white-80 mb-6" style="max-width:36rem;line-height:1.75">${escapeHtml(h.hero.description)}</p>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:2rem;font-size:0.875rem;color:rgba(255,255,255,0.7)">
            ${icon('award', 16)}
            <span>${escapeHtml(h.hero.awardText)}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:1rem">
            <a href="${h.hero.ctaPrimary.href}" class="btn-primary btn-large">${escapeHtml(h.hero.ctaPrimary.label)}</a>
            <a href="${h.hero.ctaSecondary.href}" class="btn-outline-white btn-large">${escapeHtml(h.hero.ctaSecondary.label)}</a>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img src="${h.hero.image.src}" alt="${escapeAttr(h.hero.image.alt)}" loading="lazy">
        </div>
      </div>
    </div>
  </section>

  <!-- Proof Bar -->
  <section class="section-white section-sm" style="border-bottom:1px solid rgba(217,212,207,0.4);padding:2rem 0">
    <div class="container">
      <div class="proof-bar">
        ${proofItems}
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="section-white section bg-grid">
    <div class="container">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-heading font-bold mb-4">${escapeHtml(h.services.heading)}</h2>
        <p class="text-muted">${escapeHtml(h.services.description)}</p>
      </div>
      <div class="grid grid-2" style="gap:2rem">${serviceCards}
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="section-dark section" style="position:relative">
    <div class="container">
      <div class="grid grid-2-lg gap-stack" style="align-items:center">
        <div>
          <h2 class="text-3xl font-heading font-bold mb-6">Why <span class="text-primary">Choose Us</span></h2>
          ${reasons}
        </div>
        <div style="position:relative">
          <img src="${h.whyUs.image.src}" alt="${escapeAttr(h.whyUs.image.alt)}" loading="lazy" style="box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);filter:grayscale(30%);border:4px solid rgba(255,255,255,0.05)">
          <div class="quote-overlay">
            <p>${escapeHtml(h.whyUs.quote)}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Entry Offers -->
  <section class="section-muted section">
    <div class="container">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-heading font-bold mb-4">${escapeHtml(h.entryOffers.heading)}</h2>
        <p class="text-muted">${escapeHtml(h.entryOffers.description)}</p>
      </div>
      <div class="grid grid-4" style="gap:1.5rem">${entryOffers}
      </div>
    </div>
  </section>

  <!-- Make Bold Spark -->
  <section class="spark-section section">
    <div class="container" style="position:relative;z-index:1">
      <div class="grid grid-2-lg gap-stack" style="align-items:center;margin-bottom:2rem">
        <div>
          <div class="spark-eyebrow">${icon('zap', 14)}&nbsp;${escapeHtml(h.spark.eyebrow)}</div>
          <h2 class="text-3xl font-heading font-bold mb-6" style="color:var(--white);line-height:1.2">${escapeHtml(h.spark.heading)}</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:1.05rem;line-height:1.75;margin-bottom:2.5rem;max-width:36rem">${escapeHtml(h.spark.description)}</p>
          <a href="${escapeAttr(h.spark.cta.href)}" target="_blank" rel="noopener noreferrer" class="spark-cta">
            ${escapeHtml(h.spark.cta.label)}&nbsp;${icon('external-link', 16)}
          </a>
        </div>
        <div class="grid" style="grid-template-columns:1fr;gap:1rem">
          ${h.spark.capabilities.map(cap => `
          <div class="spark-card">
            ${icon(cap.icon, 28)}
            <h3>${escapeHtml(cap.title)}</h3>
            <p>${escapeHtml(cap.description)}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section-primary section">
    <div class="container text-center">
      <h2 class="text-3xl font-heading font-bold mb-6">${escapeHtml(h.cta.heading)}</h2>
      <p class="text-white-80 max-w-2xl mx-auto mb-10 text-lg">${escapeHtml(h.cta.description)}</p>
      <div class="flex flex-col sm-flex-row gap-4 justify-center">
        <a href="${h.cta.ctaPrimary.href}" class="btn-white btn-large">${escapeHtml(h.cta.ctaPrimary.label)}</a>
        <a href="${h.cta.ctaSecondary.href}" class="btn-outline-white btn-large">${escapeHtml(h.cta.ctaSecondary.label)}</a>
      </div>
    </div>
  </section>` + footer() + closePage();
}

function buildServicesCfo() {
  const s = content.servicesCfo;

  const offerings = s.offerings.map((o, i) => {
    const features = o.features.map(f => `
                <li style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0">
                  ${icon('check-circle')}
                  <span style="font-weight:500;font-size:1.125rem">${escapeHtml(f)}</span>
                </li>`).join('');
    const cta = o.cta
      ? `<a href="${o.cta.href}" class="card-link" style="display:inline-block;margin-top:1rem">${escapeHtml(o.cta.label)} &rarr;</a>`
      : '';
    return `
  <section id="${o.id}" class="${i % 2 === 0 ? 'section-white' : 'section-muted'} section" style="scroll-margin-top:6rem">
    <div class="container">
      <div class="grid grid-2-lg gap-stack" style="align-items:center">
        <div>
          <span class="text-primary font-bold tracking-widest uppercase text-sm mb-4" style="display:block">${escapeHtml(o.kicker)}</span>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
            <div class="icon-box" style="width:3rem;height:3rem;flex-shrink:0">${icon(o.icon, 24)}</div>
            <h2 class="text-3xl font-heading font-bold">${escapeHtml(o.title)}</h2>
          </div>
          ${o.paragraphs.map(p => `<p class="text-muted text-lg leading-relaxed mb-6">${escapeHtml(p)}</p>`).join('')}
          ${cta}
        </div>
        <div class="section-white" style="padding:2.5rem;box-shadow:0 10px 25px rgba(0,0,0,0.1);border-top:4px solid var(--primary)">
          <h3 style="font-weight:700;text-transform:uppercase;letter-spacing:0.05em;font-size:0.875rem;margin-bottom:1rem">What's Included</h3>
          <ul style="list-style:none">${features}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
  }).join('\n');

  const capabilities = s.main.capabilities.map(cap => `
                <li style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0">
                  ${icon('check-circle')}
                  <span style="font-weight:500;font-size:1.125rem">${escapeHtml(cap)}</span>
                </li>`).join('');

  const entryOffers = s.entryOffers.offers.map(o => `
            <div class="card">
              <div class="icon-box" style="margin-bottom:1rem">${icon(o.icon, 20)}</div>
              <h3 style="font-weight:700;margin-bottom:0.5rem">${escapeHtml(o.title)}</h3>
              <p class="text-sm text-muted" style="margin-bottom:0.75rem">${escapeHtml(o.description)}</p>
              <span class="text-xs font-bold uppercase tracking-wider text-primary">${escapeHtml(o.tag)}</span>
            </div>`).join('');

  const segments = s.whoWeServe.segments.map(seg => `
            <div class="card">
              <h3 class="text-xl font-heading font-bold mb-4">${escapeHtml(seg.title)}</h3>
              <p class="text-muted">${escapeHtml(seg.description)}</p>
            </div>`).join('');

  return htmlHead(
    'Fractional CFO Services | Wichita & Kansas',
    'Fractional CFO services in Wichita, Kansas — cash flow management, budgeting, tax planning, controller services, and strategic financial leadership for small and midsize businesses.',
    'services-cfo.html'
  ) + navigation('services-cfo.html') + `

  <!-- Header -->
  <div class="section-dark header-accent page-header">
    <div class="container" style="position:relative;z-index:1">
      <span class="text-primary font-bold tracking-widest uppercase text-sm mb-4" style="display:block">${escapeHtml(s.header.label)}</span>
      <h1 class="text-4xl lg-text-6xl font-heading font-bold mb-6">${escapeHtml(s.header.heading)}</h1>
      <p class="text-xl text-white-80 max-w-2xl">${escapeHtml(s.header.description)}</p>
    </div>
  </div>

  <!-- Service Offerings -->
${offerings}

  <!-- Main Content -->
  <div class="container section">
    <div class="grid grid-2-lg gap-stack">
      <div>
        <h2 class="text-3xl font-heading font-bold mb-6">${escapeHtml(s.main.heading)}</h2>
        ${s.main.paragraphs.map(p => `<p class="text-muted text-lg leading-relaxed mb-6">${escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="section-white" style="padding:2.5rem;box-shadow:0 10px 25px rgba(0,0,0,0.1);border-top:4px solid var(--primary)">
        <h3 style="font-weight:700;text-transform:uppercase;letter-spacing:0.05em;font-size:0.875rem;margin-bottom:2rem">${escapeHtml('What We Can Help With')}</h3>
        <ul style="list-style:none">${capabilities}
        </ul>
      </div>
    </div>
  </div>

  <!-- Entry Offers -->
  <section class="section-muted section">
    <div class="container">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-3xl font-heading font-bold mb-4">${escapeHtml(s.entryOffers.heading)}</h2>
        <p class="text-muted">${escapeHtml(s.entryOffers.description)}</p>
      </div>
      <div class="grid grid-4" style="gap:1.5rem">${entryOffers}
      </div>
    </div>
  </section>

  <!-- Who We Serve -->
  <section class="section-muted section">
    <div class="container">
      <h2 class="text-3xl font-heading font-bold mb-12 text-center">${escapeHtml(s.whoWeServe.heading)}</h2>
      <div class="grid grid-3 max-w-5xl mx-auto" style="gap:2rem">${segments}
      </div>
    </div>
  </section>


  <section class="section-primary section">
    <div class="container text-center">
      <h2 class="text-3xl font-heading font-bold mb-6">Ready to Get Started?</h2>
      <p class="text-white-80 max-w-2xl mx-auto mb-10 text-lg">Whether you're a growing business, a sole proprietor, or a nonprofit — the first step is a conversation. No obligation, no pressure.</p>
      <div class="flex flex-col sm-flex-row gap-4 justify-center">
        <a href="contact.html" class="btn-white btn-large">Get in Touch</a>
        <a href="about.html" class="btn-outline-white btn-large">About Our Firm</a>
      </div>
    </div>
  </section>` + footer() + closePage();
}

function buildServicePage(page) {
  const pageFile = `${page.slug}.html`;

  const includedItems = page.included.items.map(item => `
            <div class="card">
              <div style="display:flex;align-items:flex-start;gap:1rem">
                <div style="flex-shrink:0;margin-top:0.25rem">${icon('check-circle', 20)}</div>
                <div>
                  <h3 style="font-weight:700;margin-bottom:0.5rem">${escapeHtml(item.title)}</h3>
                  <p class="text-sm text-muted">${escapeHtml(item.description)}</p>
                </div>
              </div>
            </div>`).join('');

  const triggers = page.whenYouNeedIt.triggers.map(t => `
            <div class="card">
              <div class="icon-box" style="margin-bottom:1rem">${icon(t.icon, 20)}</div>
              <h3 style="font-weight:700;margin-bottom:0.5rem">${escapeHtml(t.title)}</h3>
              <p class="text-sm text-muted">${escapeHtml(t.description)}</p>
            </div>`).join('');

  const steps = page.engagement.steps.map((step, i) => `
            <div class="text-center">
              <div style="width:3.5rem;height:3.5rem;margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;background:var(--primary);color:var(--white);font-family:'Be Vietnam Pro',sans-serif;font-size:1.5rem;font-weight:700">${i + 1}</div>
              <h3 class="text-xl font-heading font-bold mb-4">${escapeHtml(step.title)}</h3>
              <p class="text-muted">${escapeHtml(step.description)}</p>
            </div>`).join('');

  return htmlHead(
    page.seoTitle,
    page.seoDescription,
    pageFile
  ) + navigation(pageFile) + `

  <!-- Header -->
  <div class="section-dark header-accent page-header">
    <div class="container" style="position:relative;z-index:1">
      <span class="text-primary font-bold tracking-widest uppercase text-sm mb-4" style="display:block">${escapeHtml(page.kicker)}</span>
      <h1 class="text-4xl lg-text-6xl font-heading font-bold mb-6">${escapeHtml(page.heading)}</h1>
      <p class="text-xl text-white-80 max-w-2xl">${escapeHtml(page.subtitle)}</p>
    </div>
  </div>
${page.video ? `
  <div class="deck" style="padding-top:2.5rem">
    <div class="intro-video-frame">
      <video autoplay muted loop playsinline aria-label="${escapeAttr(page.video.label)}">
        <source src="${escapeAttr(page.video.src)}" type="video/mp4">
      </video>
    </div>
    <p class="intro-video-caption">${escapeHtml(page.video.label)}</p>
  </div>` : ''}

  <!-- Intro -->
  <div class="container section">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-heading font-bold mb-6">${escapeHtml(page.intro.heading)}</h2>
      ${page.intro.paragraphs.map(p => `<p class="text-muted text-lg leading-relaxed mb-6">${escapeHtml(p)}</p>`).join('')}
    </div>
  </div>

  <!-- When You Need It -->
  <section class="section-muted section">
    <div class="container">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-3xl font-heading font-bold mb-4">${escapeHtml(page.whenYouNeedIt.heading)}</h2>
        <p class="text-muted">${escapeHtml(page.whenYouNeedIt.description)}</p>
      </div>
      <div class="grid grid-4" style="gap:1.5rem">${triggers}
      </div>
    </div>
  </section>

  <!-- What's Included -->
  <section class="section-white section">
    <div class="container">
      <h2 class="text-3xl font-heading font-bold mb-12 text-center">${escapeHtml(page.included.heading)}</h2>
      <div class="grid grid-2 max-w-5xl mx-auto" style="gap:1.5rem">${includedItems}
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="section-muted section">
    <div class="container">
      <h2 class="text-3xl font-heading font-bold mb-12 text-center">${escapeHtml(page.engagement.heading)}</h2>
      <div class="grid grid-3 max-w-5xl mx-auto" style="gap:3rem">${steps}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section-primary section">
    <div class="container text-center">
      <h2 class="text-3xl font-heading font-bold mb-6">${escapeHtml(page.cta.heading)}</h2>
      <p class="text-white-80 max-w-2xl mx-auto mb-10 text-lg">${escapeHtml(page.cta.description)}</p>
      <div class="flex flex-col sm-flex-row gap-4 justify-center">
        <a href="contact.html" class="btn-white btn-large">Get in Touch</a>
        <a href="services-cfo.html" class="btn-outline-white btn-large">Explore All Services</a>
      </div>
    </div>
  </section>` + footer() + closePage();
}

function buildAbout() {
  const a = content.about;
  const cf = a.cofounder;

  const accomplishments = a.leader.accomplishments.map(acc =>
    `<div class="accomplishment">${escapeHtml(acc)}</div>`
  ).join('\n                    ');

  const highlights = cf.highlights.map(h =>
    `<div class="accomplishment">${escapeHtml(h)}</div>`
  ).join('\n                    ');

  return htmlHead(
    'About Our Wichita Fractional CFO Firm',
    'Make Bold Solutions is a Wichita, Kansas fractional CFO firm co-founded by Lesley and Mark Hazleton — both PricewaterhouseCoopers alumni — led by Lesley Hazleton, CPA, 2023 Wichita Business Journal CFO of the Year.',
    'about.html'
  ) + navigation('about.html') + `

  <div class="section-white page-header">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <span class="text-primary font-bold tracking-widest uppercase text-sm mb-4" style="display:block">${escapeHtml(a.hero.label)}</span>
        <h1 class="text-4xl lg-text-6xl font-heading font-bold mb-10 leading-tight">
          ${escapeHtml(a.hero.headingLine1)}<br>${escapeHtml(a.hero.headingLine2)}
        </h1>
        <div class="prose">
          ${a.hero.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n          ')}
        </div>
        <div class="grid grid-3 mt-20" style="gap:3rem">
          ${a.stats.map(s => `
            <div class="text-center">
              <div class="text-5xl font-heading font-bold mb-2">${escapeHtml(s.value)}</div>
              <div class="text-sm font-bold uppercase tracking-widest text-muted">${escapeHtml(s.label)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <section class="section-muted section">
    <div class="container">
      <h2 class="text-3xl font-heading font-bold mb-12 text-center">Leadership</h2>
      <div class="max-w-4xl mx-auto" style="display:flex;flex-direction:column;gap:2rem">

        <!-- Lesley Hazleton -->
        <div class="section-white" style="padding:2.5rem;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <div class="flex flex-col md-flex-row gap-10 items-start">
            <div class="flex-shrink-0">
              <img src="contacts/lesley-hazleton.jpg" alt="Lesley Hazleton, CPA" class="leader-avatar">
            </div>
            <div class="flex-grow">
              <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">${escapeHtml(a.leader.name)}</h3>
              <p class="text-primary font-medium text-sm uppercase tracking-wider mb-1">${escapeHtml(a.leader.title)}</p>
              <p class="text-muted text-sm mb-4">${escapeHtml(a.leader.education)}</p>

              <div class="award-badge">
                ${icon('award', 20)}
                <div>
                  <span style="font-size:0.875rem;font-weight:700">${escapeHtml(a.leader.awardTitle)}</span>
                  <span class="text-xs text-muted" style="display:block">${escapeHtml(a.leader.awardDescription)}</span>
                </div>
              </div>

              ${a.leader.bio.map(p => `<p class="text-muted mb-4">${escapeHtml(p)}</p>`).join('\n              ')}

              <h4 style="font-weight:700;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem;margin-top:1.5rem">Select Accomplishments</h4>
              <div style="display:flex;flex-direction:column;gap:0.5rem">
                ${accomplishments}
              </div>

              <div class="flex flex-wrap gap-4 mt-8">
                <a href="${content.site.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-outline text-sm">View LinkedIn Profile</a>
                <a href="cfo-of-the-year.html" class="btn-outline text-sm">CFO of the Year</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Mark Hazleton -->
        <div class="section-white" style="padding:2.5rem;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <div class="flex flex-col md-flex-row gap-10 items-start">
            <div class="flex-shrink-0">
              <img src="contacts/mark-hazleton.jpg" alt="Mark Hazleton" class="leader-avatar">
            </div>
            <div class="flex-grow">
              <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">${escapeHtml(cf.name)}</h3>
              <p class="text-primary font-medium text-sm uppercase tracking-wider mb-4">${escapeHtml(cf.title)}</p>

              ${cf.bio.map(p => `<p class="text-muted mb-4">${escapeHtml(p)}</p>`).join('\n              ')}

              <h4 style="font-weight:700;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem;margin-top:1.5rem">Highlights</h4>
              <div style="display:flex;flex-direction:column;gap:0.5rem">
                ${highlights}
              </div>

              <div class="flex flex-wrap gap-4 mt-8">
                <a href="${escapeAttr(cf.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn-outline text-sm">View LinkedIn Profile</a>
                <a href="${escapeAttr(cf.website)}" target="_blank" rel="noopener noreferrer" class="btn-outline text-sm">${escapeHtml(cf.websiteDisplay)}</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="section-primary section text-center">
    <div class="container">
      <h2 class="text-3xl font-heading font-bold mb-8">${escapeHtml(a.cta.heading)}</h2>
      <p class="text-white-80 max-w-xl mx-auto mb-8">${escapeHtml(a.cta.description)}</p>
      <a href="${a.cta.ctaHref}" class="btn-white">${escapeHtml(a.cta.ctaLabel)}</a>
    </div>
  </section>` + footer() + closePage();
}

function buildCfoOfTheYear() {
  const c = content.cfoOfTheYear;

  const sections = c.article.sections.map(s => `
              <h3 class="text-xl font-heading font-bold mt-10 mb-3">${escapeHtml(s.heading)}</h3>
              ${s.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n              ')}`).join('');

  const quotes = c.quotes.map(q => `
                <div class="quote-box">
                  <p class="text-sm font-bold uppercase tracking-wider text-primary mb-2">${escapeHtml(q.topic)}</p>
                  <p class="text-muted" style="font-style:italic">"${escapeHtml(q.text)}"</p>
                </div>`).join('');

  return htmlHead(
    '2023 Wichita Business Journal CFO of the Year',
    'Lesley Hazleton, CPA of Make Bold Solutions was named the 2023 Wichita Business Journal CFO of the Year — recognized for outstanding financial leadership in Wichita, Kansas.',
    'cfo-of-the-year.html'
  ) + navigation('cfo-of-the-year.html') + `

  <div class="section-dark header-accent page-header">
    <div class="container" style="position:relative;z-index:1">
      <a href="about.html" style="color:rgba(255,255,255,0.6);font-size:0.875rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:1.5rem">${icon('arrow-left', 16)} Back to About</a>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <span style="color:var(--primary)">${icon('award', 40)}</span>
        <span class="text-primary font-bold tracking-widest uppercase text-sm">${escapeHtml(c.header.label)}</span>
      </div>
      <h1 class="text-4xl lg-text-6xl font-heading font-bold mb-6">${escapeHtml(c.header.heading)}</h1>
      <p class="text-xl text-white-80 max-w-2xl">${escapeHtml(c.header.description)}</p>
    </div>
  </div>

  <div class="container" style="padding-top:4rem;padding-bottom:5rem">
    <div class="max-w-3xl mx-auto">
      <div class="award-info mb-12">
        ${icon('award', 32)}
        <div>
          <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">${escapeHtml(c.awardInfo.title)}</h2>
          ${c.awardInfo.paragraphs.map(p => `<p class="text-muted"${c.awardInfo.paragraphs.indexOf(p) > 0 ? ' style="margin-top:0.75rem"' : ''}>${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>

      <article class="prose">
        <h2 class="text-2xl font-heading font-bold mb-4">${escapeHtml(c.article.introHeading)}</h2>
        <p>${escapeHtml(c.article.introParagraph)}</p>
        ${sections}
      </article>

      <div style="border-top:1px solid var(--border);margin-top:3rem;padding-top:3rem">
        <h3 class="text-xl font-heading font-bold mb-6">In Lesley's Own Words</h3>
        ${quotes}
      </div>

      <div class="flex flex-col sm-flex-row gap-4 mt-12">
        <a href="about.html" class="btn-primary">Learn More About Our Firm</a>
        <a href="contact.html" class="btn-outline">Schedule a Consultation</a>
      </div>
    </div>
  </div>` + footer() + closePage();
}

function buildContact() {
  const c = content.contact;

  const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

  const profileCards = c.profiles.map(p => `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:0.75rem;padding:2rem;display:flex;flex-direction:column;gap:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <div style="width:2.5rem;height:2.5rem;background:var(--primary);border-radius:0.5rem;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0">
          ${p.type === 'company' ? icon('briefcase', 18) : icon('user', 18)}
        </div>
        <div>
          <div style="font-weight:700;font-size:1.0625rem;color:var(--dark)">${escapeHtml(p.name)}</div>
          <div style="font-size:0.8125rem;color:var(--muted-fg);font-weight:500">${escapeHtml(p.title)}</div>
        </div>
      </div>
      <p style="font-size:0.9375rem;color:var(--muted-fg);line-height:1.6;margin:0">${escapeHtml(p.description)}</p>
      <a href="${escapeAttr(p.href)}" target="_blank" rel="noopener noreferrer"
         style="display:inline-flex;align-items:center;gap:0.625rem;background:#0A66C2;color:#fff;font-weight:600;font-size:0.875rem;padding:0.625rem 1.25rem;border-radius:0.375rem;text-decoration:none;align-self:flex-start;transition:opacity 0.2s"
         onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
        ${linkedinIcon}
        ${escapeHtml(p.label)}
      </a>
    </div>`).join('\n');

  return htmlHead(
    'Connect with Make Bold Solutions',
    'Start a conversation with Make Bold Solutions on LinkedIn. Connect with Lesley Hazleton, CPA and Mark Hazleton — fractional CFO and financial leadership for growing businesses.',
    'contact.html'
  ) + navigation('contact.html') + `

  <div class="section-dark page-header header-accent">
    <div class="container" style="position:relative;z-index:1">
      <span class="text-primary font-bold tracking-widest uppercase text-sm mb-4" style="display:block">${escapeHtml(c.header.label)}</span>
      <h1 class="text-4xl lg-text-5xl font-heading font-bold mb-6">${escapeHtml(c.header.heading)}</h1>
      <p class="text-white-80 text-lg max-w-2xl">${escapeHtml(c.header.description)}</p>
    </div>
  </div>

  <section class="section">
    <div class="container" style="max-width:52rem">
      <div style="display:grid;grid-template-columns:1fr;gap:1.5rem">
        ${profileCards}
      </div>
      <p style="margin-top:2.5rem;text-align:center;font-size:0.9375rem;color:var(--muted-fg)">
        We look forward to connecting and learning about your business.
      </p>
    </div>
  </section>` + footer() + closePage();
}

function buildNotFound() {
  const nf = content.notFound;
  return htmlHead('Page Not Found', nf.description, '404.html', { robots: 'noindex, follow' }) + navigation('') + `

  <div class="not-found">
    <h1 class="text-4xl font-heading font-bold mb-4">${escapeHtml(nf.heading)}</h1>
    <p class="text-muted text-lg mb-8">${escapeHtml(nf.description)}</p>
    <a href="${nf.ctaHref}" class="btn-primary">${escapeHtml(nf.ctaLabel)}</a>
  </div>` + footer() + closePage();
}

// ─── Digital Business Cards ──────────────────────────────────────────────────

const cards = [
  {
    slug: 'markhazleton',
    name: 'Mark W. Hazleton',
    firstName: 'Mark',
    lastName: 'Hazleton',
    role: 'Chief Technology Officer',
    tagline: 'Solutions architect turning technology into tangible business results.',
    email: 'mark.hazleton@makeboldsolutions.com',
    phone: '+1-972-322-1066',
    phoneDisplay: '+1 972-322-1066',
    personalUrl: 'https://markhazleton.com',
    personalUrlDisplay: 'markhazleton.com',
    linkedin: 'https://www.linkedin.com/in/markhazleton/',
    photo: 'contacts/mark-hazleton.jpg',
    vcf: 'contacts/mark-hazleton.vcf',
  },
  {
    slug: 'lesleyhazleton',
    name: 'Lesley B. Hazleton',
    firstName: 'Lesley',
    lastName: 'Hazleton',
    role: 'Chief Executive Officer',
    tagline: 'Finance executive driving strategic growth, risk management, and operational excellence.',
    email: 'lesley.hazleton@makeboldsolutions.com',
    phone: '+1-972-322-1065',
    phoneDisplay: '+1 972-322-1065',
    personalUrl: 'https://lesleyhazleton.com',
    personalUrlDisplay: 'lesleyhazleton.com',
    linkedin: 'https://www.linkedin.com/in/lesleyhazleton/',
    photo: 'contacts/lesley-hazleton.jpg',
    vcf: 'contacts/lesley-hazleton.vcf',
  },
];

async function generateQrSvg(url) {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 1,
    width: 160,
    errorCorrectionLevel: 'M',
    color: { dark: '#1E1E1E', light: '#FFFFFF' },
  });
}

async function buildCard(person) {
  const cardUrl = `${content.site.url}/${person.slug}/card/`;
  const metaDesc = `Connect with ${person.name}, ${person.role} of Make Bold Solutions.`;
  const qrSvg = await generateQrSvg(cardUrl);
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.role,
    "image": `${content.site.url}/${person.photo}`,
    "email": person.email,
    "telephone": person.phone,
    "url": person.personalUrl,
    "sameAs": [person.linkedin, person.personalUrl],
    "worksFor": {
      "@type": "Organization",
      "name": "Make Bold Solutions",
      "url": content.site.url
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${escapeHtml(person.name)} — ${escapeHtml(person.role)} | Make Bold Solutions</title>
  <meta name="description" content="${escapeAttr(metaDesc)}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${escapeAttr(cardUrl)}">

  <meta property="og:type" content="profile">
  <meta property="og:url" content="${escapeAttr(cardUrl)}">
  <meta property="og:site_name" content="Make Bold Solutions">
  <meta property="og:title" content="${escapeAttr(person.name)} — ${escapeAttr(person.role)}, Make Bold Solutions">
  <meta property="og:description" content="${escapeAttr(metaDesc)}">
  <meta property="og:image" content="${escapeAttr(content.site.url)}/${escapeAttr(person.photo)}">
  <meta property="og:image:alt" content="${escapeAttr(person.name)}">
  <meta property="og:locale" content="en_US">
  <meta property="profile:first_name" content="${escapeAttr(person.firstName)}">
  <meta property="profile:last_name" content="${escapeAttr(person.lastName)}">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="${escapeAttr(cardUrl)}">
  <meta name="twitter:title" content="${escapeAttr(person.name)} — ${escapeAttr(person.role)}, Make Bold Solutions">
  <meta name="twitter:description" content="${escapeAttr(metaDesc)}">
  <meta name="twitter:image" content="${escapeAttr(content.site.url)}/${escapeAttr(person.photo)}">

  <script type="application/ld+json">${schemaJson}</script>

  <link rel="icon" type="image/png" href="/favicon.png">
  <meta name="theme-color" content="#982407">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main class="card-page">
    <div class="card-brand">
      <a href="/" aria-label="Make Bold Solutions home">
        <img src="/logo-nav.svg" alt="Make Bold Solutions" class="card-brand-logo">
      </a>
    </div>

    <div class="card-content">
      <img src="/${person.photo}" alt="${escapeAttr(person.name)}" width="160" height="160" fetchpriority="high" class="card-avatar">

      <h1 class="card-name">${escapeHtml(person.name)}</h1>
      <p class="card-role">${escapeHtml(person.role)}</p>
      <p class="card-org">Make Bold Solutions</p>
      <p class="card-tagline">${escapeHtml(person.tagline)}</p>
      <p class="card-hint">Tap, scan, or save my contact card.</p>

      <div class="card-actions">
        <a href="/${person.vcf}" class="card-cta-primary">${icon('users', 20)}Add to Contacts</a>
        <a href="${escapeAttr(person.linkedin)}" target="_blank" rel="noopener" class="card-cta-secondary">${icon('linkedin', 18)}Connect on LinkedIn</a>
        <button
          type="button"
          data-share-button
          data-share-title="${escapeAttr(person.name)} — Make Bold Solutions"
          data-share-text="${escapeAttr(person.name)}, ${escapeAttr(person.role)} at Make Bold Solutions"
          data-share-url="${escapeAttr(cardUrl)}"
          class="card-cta-tertiary"
        >${icon('external-link', 18)}<span class="card-cta-label">Share Contact</span></button>
      </div>

      <div class="card-qr-box">
        ${qrSvg}
        <p class="card-qr-caption">Scan to save this card</p>
      </div>

      <div class="card-info">
        <a href="mailto:${escapeAttr(person.email)}">${escapeHtml(person.email)}</a>
        <span>${escapeHtml(person.phoneDisplay)}</span>
        <a href="${escapeAttr(person.personalUrl)}" target="_blank" rel="noopener">${escapeHtml(person.personalUrlDisplay)}</a>
      </div>

      <a href="https://makeboldspark.com" target="_blank" rel="noopener" class="card-spark-link">${icon('zap', 14)}Also building Make Bold Spark ↗</a>
    </div>

    <footer class="card-footer">
      &copy; ${new Date().getFullYear()} <a href="/">Make Bold Solutions LLC</a>
    </footer>
  </main>
  <script>
  document.querySelectorAll('[data-share-button]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var label = button.querySelector('.card-cta-label');
      var shareData = {
        title: button.dataset.shareTitle || document.title,
        text: button.dataset.shareText || '',
        url: button.dataset.shareUrl || window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); return; } catch (e) { return; }
      }
      try {
        await navigator.clipboard.writeText(shareData.url);
        var original = label.textContent;
        label.textContent = 'Link copied!';
        setTimeout(function () { label.textContent = original; }, 2000);
      } catch (e) {
        window.location.href = 'mailto:?subject=' + encodeURIComponent(shareData.title) + '&body=' + encodeURIComponent(shareData.url);
      }
    });
  });
  </script>
</body>
</html>`;
}

// ─── Build All Pages ─────────────────────────────────────────────────────────

const pages = [
  { file: 'index.html', builder: buildHome },
  { file: 'services-cfo.html', builder: buildServicesCfo },
  ...content.servicePages.map(page => ({
    file: `${page.slug}.html`,
    builder: () => buildServicePage(page)
  })),
  { file: 'about.html', builder: buildAbout },
  { file: 'cfo-of-the-year.html', builder: buildCfoOfTheYear },
  { file: 'contact.html', builder: buildContact },
  { file: '404.html', builder: buildNotFound },
  ...cards.map(person => ({ file: `${person.slug}/card/index.html`, builder: () => buildCard(person) })),
];

console.log('Building static site...');
for (const page of pages) {
  const html = await page.builder();
  const outPath = join(docsDir, page.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf-8');
  console.log(`  ✓ ${page.file}`);
}
console.log(`\nDone! ${pages.length} pages built in docs/`);
