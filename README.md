# Guardian — Design System Documentation & QA

A design system tool that generates component documentation and audits UI against design system standards. Built with a shadcn-inspired dark theme.

## Features

- **Docs Generator** — Generate documentation for design system components from Figma or GitHub links
- **QA Checker** — Upload designs and run audits against your source of truth
- **Configuration** — Set up documentation templates, Claude API, and Figma integration
- **Component documentation** — View generated docs for Button, Input, Tag, Chips
- **Audit results** — Violations report with severity, expected fixes, and auto-fix actions

## Flow

1. **Start** — Choose Docs Generator or QA Checker, paste a Figma/GitHub link
2. **Configuration** (first-time) — Documentation template, Claude API, Figma tabs
3. **Docs** — Analyze → Loading → Component documentation view
4. **QA** — See a Live Audit → Upload designs, set source of truth → Run Audit → Loading → Results

## File Structure

```
design-system-guardian/
├── index.html          # App entry (Guardian app)
├── app/
│   ├── app.js          # Router, state, screens
│   └── app.css         # shadcn-inspired dark theme
├── documentation.html  # Legacy docs flow
├── documentation-edit.html
├── documentation.js
├── documentation.css
└── README.md
```

## Viewing

Open `index.html` in a browser. No build step required.

## Publishing (GitHub Pages)

```bash
git add .
git commit -m "Update Guardian app"
git push origin main
```

Enable GitHub Pages (Settings → Pages → Deploy from branch `main`). Site: `https://YOUR_USERNAME.github.io/design-system-guardian/`
