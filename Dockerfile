# Multi-stage Docker build for OAOA Style Framework
FROM python:3.11-slim AS builder

WORKDIR /build
COPY . .
RUN python3 scripts/build.py

FROM nginx:alpine

# Copy built distribution assets to nginx web root
COPY --from=builder /build/dist /usr/share/nginx/html
# Also copy root index.html, framework.css, framework.js for root access
COPY framework.css framework.js index.html /usr/share/nginx/html/
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
