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

# Copy the client build output
# Trailing slash on source ensures we copy the CONTENTS of the directory
COPY --from=build /app/dist/client/ /usr/share/caddy/

# Create Caddyfile for proper SPA routing
RUN cat > /etc/caddy/Caddyfile <<'EOF'
:8080 {
    root * /usr/share/caddy
    encode gzip

    # Handle SPA routing
    try_files {path} /index.html

    # Default file server
    file_server
}
EOF

EXPOSE 8080
