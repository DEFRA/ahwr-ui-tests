FROM --platform=linux/amd64 node:22-bookworm-slim AS node

FROM --platform=linux/amd64 selenium/standalone-chrome:133.0-20250222

USER root

# Copy Node.js from the official image (same platform as the final image)
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && node -v && npm -v

# Global tools (before app files so this layer caches well)
RUN npm install -g browserstack-local

# Set working directory and give the non-root user ownership
WORKDIR /app
RUN chown seluser:seluser /app

# Copy package files first to optimize caching
COPY --chown=seluser:seluser package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy the rest of the application files
COPY --chown=seluser:seluser . .

# Switch to non-root user for security
USER seluser

CMD ["tail", "-f", "/dev/null"]