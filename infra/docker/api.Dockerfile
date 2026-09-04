FROM node:22-alpine AS base
WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY services/api/package.json services/api/package.json
COPY package.json ./package.json
RUN pnpm install --no-frozen-lockfile

COPY services/api services/api
WORKDIR /workspace/services/api
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=base /workspace/node_modules /app/node_modules
COPY --from=base /workspace/services/api/package.json /app/package.json
COPY --from=base /workspace/services/api/dist /app/dist
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]
