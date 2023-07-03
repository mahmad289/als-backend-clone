# Install dependencies only when needed
FROM node:18-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./package.json ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:18-alpine As builder

WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./nest-cli.json ./nest-cli.json
COPY ./libs ./libs
COPY ./apps/installer ./

CMD ["npx", "nestjs-command", "run:installer"]