# House

pnpm monorepo:

- `web/` – Next.js (App Router, TypeScript, Tailwind) on http://localhost:3000
- `bff/` – NestJS backend-for-frontend (TypeScript, ESM) on http://localhost:4000

## Setup

Requires Node >= 20.9 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # run web + bff together
pnpm dev:web      # web only
pnpm dev:bff      # bff only
```

## Quality

Biome handles formatting and linting for the whole repo (`biome.json` at the root).

```bash
pnpm check        # format + lint + import sorting (read-only)
pnpm check:fix    # apply fixes
pnpm typecheck
pnpm build
```

VS Code: install the recommended Biome extension; format-on-save is configured in `.vscode/settings.json`.
