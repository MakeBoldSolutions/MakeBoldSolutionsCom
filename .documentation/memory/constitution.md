# Make Bold Solutions Constitution

## Core Principles

### I. Brand and Content Accuracy (NON-NEGOTIABLE)

Public copy, contact details, service descriptions, awards, credentials, and
company positioning must be accurate and consistent with Make Bold Solutions'
current approved content. Changes to business-critical claims require review
against `content.json`, brand documentation, and generated output in `docs/`.

### II. Static Site Simplicity

This repository is a static marketing site. Prefer generated HTML, CSS, and
small focused JavaScript over adding client-side frameworks, backends,
databases, or build complexity. New dependencies must have a clear benefit and
must not make Azure Static Web Apps deployment harder to reason about.

### III. Production Output Integrity

The committed `docs/` directory is the Azure Static Web Apps deployment output and must
stay synchronized with source changes. Any change to `build.js`, `content.json`,
or files under `static/` or `attached_assets/` that affects rendered pages must
include a regenerated `docs/` output.

### IV. Accessibility and Usability

Pages must remain accessible, readable, keyboard navigable, and mobile-friendly.
Preserve semantic HTML, meaningful alt text where images convey content, clear
focus states, sufficient color contrast, and forms or contact links that work
without surprising users.

### V. Performance and Reliability

The site should load quickly and fail gracefully. Keep assets optimized, avoid
unnecessary runtime scripts, and verify generated pages before shipping. Build
and serve commands must stay simple enough for any contributor to run locally.

### VI. Ownership Boundary

DevSpark framework files live in `.devspark/` and may be refreshed by upgrade
flows. Project artifacts, specifications, decisions, and team overrides live in
`.documentation/` and must not be overwritten by DevSpark upgrades. Existing
project documentation in `documentation/` remains part of the website source and
brand/project reference material.

## Technology

- Node.js 18+ with npm scripts
- Static site generator implemented in `build.js`
- Site content stored in `content.json`
- Generated Azure Static Web Apps output in `docs/`
- Source static assets in `static/` and `attached_assets/`
- No backend, database, or client-side framework

## Development Workflow

- Update source content first, then run `npm run build` when generated pages are
  affected.
- Use `npm run dev` for local iteration and `npm run serve` to inspect existing
  build output.
- Keep changes scoped to the website behavior or content being modified.
- Use DevSpark specs for substantive features and lightweight quickfixes for
  narrow corrections.

## Governance

This constitution guides planning, implementation, and review for this
repository. Amendments should be documented in `.documentation/decisions/` when
they materially change project rules or review expectations.

**Version**: 0.1.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
