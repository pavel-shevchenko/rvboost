FROM node:18.17.0-alpine
WORKDIR /project_root/apps/api

RUN apk add \
    curl \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

RUN mkdir -p /bin && curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v8.10.2/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV PATH /project_root/node_modules/.bin:$PATH

RUN apk add --no-cache postgresql-client

# RUN apk add --no-cache chromium
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD NODE_OPTIONS="--max-old-space-size=12288" turbo dev --filter=api...
