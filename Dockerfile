# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

RUN echo 'server { listen 80; root /usr/share/nginx/html; location /up { return 200 "OK"; add_header Content-Type text/plain; } location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/up || exit 1

CMD ["nginx", "-g", "daemon off;"]
