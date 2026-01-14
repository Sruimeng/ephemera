# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_API_BASE_URL
ARG VITE_BASE_URL
ARG VITE_USE_MOCK=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK
RUN pnpm build-production

# Production stage (SSR requires Node runtime)
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Copy build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "start"]
