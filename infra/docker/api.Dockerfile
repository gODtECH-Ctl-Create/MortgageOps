FROM node:22-alpine AS base
WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY services/api/package.json services/api/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/schemas/package.json packages/schemas/package.json
RUN pnpm install --no-frozen-lockfile

COPY packages/domain packages/domain
COPY packages/schemas packages/schemas
COPY services/api services/api
WORKDIR /workspace/services/api
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=base /workspace/node_modules /app/node_modules
COPY --from=base /workspace/packages /app/packages
COPY --from=base /workspace/services/api/package.json /app/package.json
COPY --from=base /workspace/services/api/dist /app/dist
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]
