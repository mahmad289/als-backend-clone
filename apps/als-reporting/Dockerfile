# Install dependencies only when needed
FROM node:18-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./package.json ./
RUN yarn install

# Install dependencies
RUN apk update && apk add --no-cache \
    g++ \
    chromium \
    chromium-chromedriver

# Set Puppeteer environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY ./.eslintrc.js ./.eslintrc.js
COPY ./.prettierrc ./.prettierrc
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./nest-cli.json ./nest-cli.json
COPY ./libs ./libs
COPY ./apps/als-reporting ./apps/als-reporting
COPY ./templates ./templates

# For installing chromium 
COPY ./runner.sh ./runner.sh 
RUN chmod +x ./runner.sh
RUN ./runner.sh

# Create Build command for HQ
RUN yarn build als-reporting

# Production image, copy all the files
FROM node:18-alpine AS runner
WORKDIR /app

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy templates folder into the dist folder
COPY  --from=builder /app/templates /app/dist/apps/als-reporting/templates/

COPY .buildinfo ./

CMD ["yarn", "run", "start:prod-reporting"]