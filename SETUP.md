# Guardian Setup

## React + shadcn/ui (Recommended)

The app uses **React**, **Vite**, **Tailwind CSS**, and **shadcn/ui** components.

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Build for production

```bash
npm run build
```

Output is in `dist/`.

### Add more shadcn components

```bash
npx shadcn@latest add <component-name>
```

Examples: `button`, `input`, `card`, `tabs`, `badge`, `table`, `alert`, `dialog`

## Vanilla JS (Legacy)

The original vanilla HTML/JS app is still available at `index-vanilla.html`. Open it directly in a browser or serve with a static server.

## Cursor Rule

The `.cursor/rules/shadcn-ui.mdc` rule instructs the AI to use shadcn/ui components for all Guardian development.
