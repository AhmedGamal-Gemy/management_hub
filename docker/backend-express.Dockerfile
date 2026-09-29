# Original Express API (strangler source). Build context is the REPO ROOT.
# Runs `pnpm build` (esbuild bundle) then `pnpm start` (node dist).
# PORT arrives via environment (compose sets 5000).
FROM node:20-alpine
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY frontend/package.json ./frontend/
COPY backend-express/package.json ./backend-express/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/db/package.json ./lib/db/
# NOTE: full-workspace install, NOT --filter. A filtered install produced
# absolute host-path symlinks in this image; the full install (same as the
# frontend image) yields correct relative links.
# Defensive: drop anything the build context may have smuggled in so pnpm
# links this install from scratch (stale/broken links are never repaired).
RUN rm -rf ./backend-express/node_modules ./lib/*/node_modules ./node_modules && pnpm install
COPY backend-express ./backend-express
COPY lib ./lib
EXPOSE 5000
CMD ["sh", "-c", "pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/api-server run start"]
