# Workspace-aware dev image. Build context is the REPO ROOT
# (see docker-compose.yml), not ./frontend.
FROM node:20-alpine
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY frontend/package.json ./frontend/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-spec/package.json ./lib/api-spec/
# Defensive: drop anything the build context may have smuggled in so pnpm
# links this install from scratch (stale/broken links are never repaired).
RUN rm -rf ./frontend/node_modules ./lib/*/node_modules ./node_modules && pnpm install
COPY frontend ./frontend
COPY lib ./lib
EXPOSE 5173
# PORT / BASE_PATH / API_PROXY_TARGET arrive via compose environment.
CMD ["pnpm", "--filter", "@workspace/management-hub", "run", "dev"]
