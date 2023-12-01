# The `web` Dockerfile is copy-pasted into turborepo main docs at /docs/handbook/deploying-with-docker

FROM node:18.17.0-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

RUN apk add \
    curl \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

RUN mkdir -p /web_app_root
WORKDIR /web_app_root

RUN mkdir -p /bin && curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v8.10.2/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV PATH /web_app_root/apps/web/node_modules/.bin:$PATH

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install turbo --global

COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18.17.0-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

RUN apk add \
    curl \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

RUN mkdir -p /web_app_root
WORKDIR /web_app_root

RUN mkdir -p /bin && curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v8.10.2/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV PATH /web_app_root/apps/web/node_modules/.bin:$PATH

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN pnpm install turbo --global

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .npmrc .npmrc
COPY --from=builder /web_app_root/out/json/ .
COPY --from=builder /web_app_root/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /web_app_root/out/full/ .
COPY turbo.json turbo.json
COPY .env ./apps/web/.env.production

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=12288" turbo build --filter=web...

FROM node:18.17.0-alpine AS runner
RUN mkdir -p /web_app_root
WORKDIR /web_app_root
ENV PATH /web_app_root/apps/web/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 web
USER web

COPY --from=installer /web_app_root/apps/web/public ./apps/web/public
COPY --from=installer /web_app_root/apps/web/next.config.js .
COPY --from=installer /web_app_root/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=web:nodejs /web_app_root/apps/web/.next/standalone ./
COPY --from=installer --chown=web:nodejs /web_app_root/apps/web/.next/static ./apps/web/.next/static

ENV NODE_OPTIONS --openssl-legacy-provider --max-old-space-size=12288
CMD node apps/web/server.js
