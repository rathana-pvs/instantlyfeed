# ── Stage 1: Dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules (sharp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json .npmrc ./
RUN npm ci --ignore-scripts

# ── Stage 2: Builder ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide dummy env vars so Next.js can build without a live DB
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=build-time-secret-replace-at-runtime
ENV DATABASE_URI=postgresql://placeholder:placeholder@placeholder:5432/placeholder

# NEXT_PUBLIC_* values are inlined into BOTH client and server bundles at
# build time, so they must be present here — runtime env vars cannot change them.
# docker-compose.prod.yml passes them in as build args from the server's .env.
ARG NEXT_PUBLIC_SITE_URL=https://instantlyfeed.com
ARG NEXT_PUBLIC_SITE_NAME=InstantlyFeed
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_ADS_KEEPER_SITE_ID
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_3
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED
ARG NEXT_PUBLIC_ADS_KEEPER_WIDGET_BOTTOM_FEED
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_ADS_KEEPER_SITE_ID=$NEXT_PUBLIC_ADS_KEEPER_SITE_ID
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_3=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_3
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED
ENV NEXT_PUBLIC_ADS_KEEPER_WIDGET_BOTTOM_FEED=$NEXT_PUBLIC_ADS_KEEPER_WIDGET_BOTTOM_FEED

RUN npm run build

# ── Stage 3: Runner (lean production image) ──────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public           ./public
COPY --from=builder /app/next.config.mjs  ./next.config.mjs
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/payload-types.ts  ./payload-types.ts
COPY --from=builder /app/tsconfig.json     ./tsconfig.json

# Next.js standalone output (set output: 'standalone' in next.config is optional;
# here we copy the whole .next + node_modules for simplicity on a single droplet)
COPY --from=builder --chown=nextjs:nodejs /app/.next          ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules   ./node_modules
COPY --from=builder /app/src               ./src

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "start"]
