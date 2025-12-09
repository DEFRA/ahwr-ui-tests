FROM --platform=linux/amd64 selenium/standalone-chrome:133.0-20250222

USER root

# Install necessary dependencies and NVM
RUN apt-get update && apt-get install -y curl bash \
    && rm -rf /var/lib/apt/lists/* \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Set environment variables for NVM and Node.js
ENV NODE_VERSION=22.14.0
ENV NVM_DIR=$HOME/.nvm
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin:$PATH"

# Install Node.js and set it as default
RUN bash -c ". $NVM_DIR/nvm.sh && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} && nvm alias default ${NODE_VERSION}" \
    && ln -s "$NVM_DIR/versions/node/v${NODE_VERSION}/bin/node" /usr/local/bin/node \
    && ln -s "$NVM_DIR/versions/node/v${NODE_VERSION}/bin/npm" /usr/local/bin/npm \
    && ln -s "$NVM_DIR/versions/node/v${NODE_VERSION}/bin/npx" /usr/local/bin/npx

# Set working directory
WORKDIR /app

# Copy package files first to optimize caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy the rest of the application files
COPY . .

# Switch to non-root user for security
USER seluser

CMD ["tail", "-f", "/dev/null"]
