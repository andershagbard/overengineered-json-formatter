# Overengineered JSON Viewer

> An overengineered Chrome extension for viewing JSON. Yes, we used React, TypeScript, Tailwind CSS v4, Radix UI, i18next, and a full Vite build pipeline for this. No, we are not sorry.

Chrome has a built-in JSON viewer. It's fine. This is not fine - it's so much more than fine. It automatically detects JSON pages and replaces the browser's default rendering with an interactive, syntax-highlighted, collapsible tree view, complete with 9 color themes, 3 tab width options, and a settings popover built with Radix UI.

## Features

- Auto-detects JSON pages (`application/json` and `text/json` content types) and replaces the default browser output
- Interactive collapsible/expandable tree for nested objects and arrays
- Syntax highlighting for all JSON value types
- Settings with configurable tab width, color mode, and color theme
- Depth-level filter buttons - collapse or expand the tree to a specific nesting level
- Stats bar showing total node count and maximum depth of the parsed structure
- Individual JSON values can be copied by clicking the copy button that appears on hover. For when you need exactly that one nested string 4 levels deep
- Fully accessible - Not just for vision impaired users, but also great for those you want to avoid using a mouse
- English UI strings backed by i18next, because maybe one day someone will want this in Frxnch

## Tech Stack

Did you really need React for a JSON viewer? Absolutely not. Did we use it anyway? Yes.

| Category        | Tools                                 |
| --------------- | ------------------------------------- |
| UI              | React 19, TypeScript, Tailwind CSS v4 |
| Build           | Vite, @crxjs/vite-plugin              |
| Components      | Radix UI                              |
| Icons           | lucide-react                          |
| i18n            | i18next, react-i18next                |
| Testing         | Vitest                                |
| Linting         | ESLint                                |
| Formatting      | Prettier                              |
| Package Manager | pnpm                                  |

## Development

```bash
pnpm install
pnpm dev        # Start dev server with HMR
pnpm build      # Production build
pnpm test       # Run unit tests
pnpm test:ui    # Visual test pages
pnpm lint       # Check code quality
pnpm format     # Auto-format source
```

### Loading the extension in Chrome

1. Run `pnpm build`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder
