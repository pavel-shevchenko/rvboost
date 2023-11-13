# The `api` Dockerfile is copy-pasted into turborepo main docs at /docs/handbook/deploying-with-docker

FROM node:18.17.0-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

RUN apk add \
    curl \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

RUN mkdir -p /api_app_root
WORKDIR /api_app_root

RUN mkdir -p /bin && curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v8.10.2/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV PATH /api_app_root/node_modules/.bin:$PATH

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install turbo --global

COPY . .
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18.17.0-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

RUN apk add \
    curl \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

RUN mkdir -p /api_app_root
WORKDIR /api_app_root

RUN mkdir -p /bin && curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v8.10.2/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV PATH /api_app_root/node_modules/.bin:$PATH

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .npmrc .npmrc
COPY --from=builder /api_app_root/out/json/ .
COPY --from=builder /api_app_root/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /api_app_root/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN NODE_OPTIONS="--max-old-space-size=12288" turbo build --filter=api...

FROM node:18.17.0-alpine AS runner
WORKDIR /api_app_root

RUN apk add --no-cache chromium
RUN apk update
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Don't run production as root
RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api
USER api
COPY --from=installer /api_app_root .

CMD NODE_OPTIONS="--max-old-space-size=12288" node apps/api/dist/main.js
