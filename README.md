# Connective Technologies — Website

People-centric technology that connects, protects and accelerates business
transformation. This repository contains the static marketing site.

## Structure

```
.
├── index.html                # Homepage (same as Homepage.html)
├── Homepage.html             # Homepage source
├── pages/                    # All inner pages
│   ├── ct-pages.css          # Shared styles for inner pages
│   ├── ct-pages.js           # Shared behaviour for inner pages
│   ├── about.html
│   ├── contact.html
│   ├── news.html             # News & insights listing
│   ├── managed-services.html · cyber-security.html · cloud-hybrid.html
│   ├── connectivity.html · ai-transformation.html · compliance-governance.html
│   ├── ct-social-value.html · ct-care.html · ct-professional.html
│   ├── ct-business.html · ct-operations.html
│   └── <article-slug>.html   # Individual news articles
├── brand/                    # Brand tokens + reference
│   └── tokens.css            # Colour, type and spacing variables
└── assets/                   # Images (WebP), SVGs, hero-circuit animation
    ├── hero/                 # Per-sector hero backgrounds
    ├── news/                 # Article imagery
    ├── partners/             # Partner / vendor logos
    └── accreditations/       # ISO / Cyber Essentials marks
```

## Running locally

It's a static site — no build step. Serve the folder with any static server:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

Opening `index.html` directly via `file://` also works, though a local
server is recommended so relative asset paths resolve consistently.

## Notes

- All raster imagery is **WebP** for performance.
- `brand/tokens.css` holds the design tokens; inner pages share
  `pages/ct-pages.css` and `pages/ct-pages.js`.
- The animated hero/footer circuit is driven by `assets/hero-circuit.js`.

© 2026 Connective Technologies. All rights reserved.
