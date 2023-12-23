# The `web` Dockerfile is copy-pasted into turborepo main docs at /docs/handbook/deploying-with-docker

FROM node:18.17.0-alpine
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

RUN pnpm install --frozen-lockfile

COPY .env ./apps/web/.env.production

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=12288" turbo build --filter=web...

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 web
USER web

WORKDIR /web_app_root/apps/web
ENV NODE_OPTIONS --openssl-legacy-provider --max-old-space-size=12288
CMD ["node_modules/.bin/next", "start"]
