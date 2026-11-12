# syntax=docker/dockerfile:1
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=80 DATA_DIR=/app/data
COPY --chown=node:node package*.json ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    npm ci --omit=dev && mkdir -p /app/data && chown node:node /app/data
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node content ./content
USER node
VOLUME /app/data
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:80/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.js"]
