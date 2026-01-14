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

# Create Caddyfile for proper SPA routing and MIME types
RUN cat > /etc/caddy/Caddyfile <<'EOF'
:8080 {
    root * /usr/share/caddy
    encode gzip

    # Handle SPA routing
    try_files {path} {path}/ /index.html

    # Ensure correct MIME types for JS/CSS
    @js path *.js
    handle @js {
        header Content-Type application/javascript
        file_server
    }

    @css path *.css
    handle @css {
        header Content-Type text/css
        file_server
    }

    # Default file server
    file_server
}
EOF

EXPOSE 8080
