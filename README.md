# pjnhek.com

Custom portfolio for **James Nhek** — AI Engineer at Asurion.

See [`.planning/PROJECT.md`](./.planning/PROJECT.md) for the full project brief.

## Local development

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm lint        # eslint .
pnpm typecheck   # tsc --noEmit
pnpm format:check
pnpm build
```

Requires **Node 22 LTS** (`>=22.18`) and **pnpm 10.x**. Versions are pinned in
`package.json` (`packageManager`, `engines.node`) and enforced by `.npmrc`
(`engine-strict=true`, `package-manager-strict=true`).
