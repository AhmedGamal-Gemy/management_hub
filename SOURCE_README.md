# Professional Management Hub — source archive

This archive contains the source for the Professional Management Hub.

## Main areas

- `artifacts/management-hub` — React/Vite frontend
- `artifacts/api-server` — Express API server
- `lib/api-spec` — OpenAPI contract and codegen configuration
- `lib/api-client-react` — generated React Query client
- `lib/api-zod` — generated request/response validation types
- `lib/db` — Drizzle schema and database package

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/management-hub run typecheck
```

The Replit environment supplies the required Clerk, database, and object-storage environment variables. Do not commit secret values.
