# syntax=docker/dockerfile:1
# =============================================================================
# SYNOTIX WEBSEITE (synotix.de) — Next.js Standalone
# =============================================================================
# Build erfolgt über docker-compose (Profil "site") aus synotix-optimized/.
# Laufzeit-Secrets (MISTRAL_API_KEY, RESEND_API_KEY) kommen als Umgebungs-
# variablen zur Laufzeit — NICHT als Build-Args, sonst landen sie im Image.
# =============================================================================

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* werden zur Build-Zeit ins Client-Bundle eingebacken.
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""
ARG NEXT_PUBLIC_PLAUSIBLE_SRC=""
# STAGING=1 → noindex-Header (wird beim Build in die Routen eingebacken)
ARG STAGING=""
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_PLAUSIBLE_SRC=$NEXT_PUBLIC_PLAUSIBLE_SRC \
    STAGING=$STAGING \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
