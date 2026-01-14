FROM node:20-alpine AS build
LABEL "language"="nodejs"
LABEL "framework"="react-router"

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN pnpm build

# Production stage
FROM zeabur/caddy-static:latest

# Copy only the client build output
COPY --from=build /app/dist/client/* /usr/share/caddy/

EXPOSE 8080
