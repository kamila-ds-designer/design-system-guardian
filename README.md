# Design System Guardian — Homepage POC

A desktop-first SaaS homepage implementation for **Design System Guardian**, a tool that combines documentation generation and design system auditing for product designers, design system maintainers, and frontend engineers.

## Overview

This implementation follows the Design System Guardian Homepage POC plan and delivers:

- **Hero** — Headline, value prop, primary/secondary CTAs, product mockup placeholder
- **Two Pillars** — Documentation and Audit cards with icons and links
- **Features** — 4-step "How it works" flow (Connect → Configure → Generate/Audit → Fix)
- **Integration Stack** — Figma, shadcn/ui, Storybook, Code patterns
- **CTA** — Repeated primary CTA with "Book a demo"
- **Footer** — Logo, nav links, legal

## Design Tokens

| Token | Value |
|-------|-------|
| Canvas | 1440px max-width |
| Background | #FAFAFA |
| Primary accent | #000000 |
| Borders | 1px, #E5E5E5 |
| Shadows | 0 1px 3px rgba(0,0,0,0.08) |
| Font | Inter |
| Spacing | 8px base grid (16, 24, 32, 48px) |

## File Structure

```
design-system-guardian/
├── index.html    # Homepage with all sections
├── styles.css    # Design tokens, components, sections
├── README.md     # This file
└── DESIGN_TOKENS.md  # Token spec for Figma handoff
```

## Viewing

Open `index.html` in a browser. No build step required.

## Publishing

### GitHub Pages

1. Create a new repo on GitHub (e.g. `design-system-guardian`)
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/design-system-guardian.git
   git push -u origin main
   ```
3. In GitHub: **Settings → Pages → Source**: Deploy from branch `main`, folder `/` (root)
4. Site will be at `https://YOUR_USERNAME.github.io/design-system-guardian/`

### Netlify (drag & drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `design-system-guardian` folder into the drop zone
3. You’ll get a live URL immediately

### Vercel (with Node)

```bash
npx vercel design-system-guardian
```

## Figma Handoff

Class names mirror the plan's frame naming for easy translation:

- `Section_Hero`, `Section_TwoPillars`, `Section_Features`, etc.
- `Card_Pillar`, `Card_Feature`, `Button_Primary`, `Button_Secondary`
- `Integration_Item`, `Section_Footer`

See `DESIGN_TOKENS.md` for values to replicate in Figma.
