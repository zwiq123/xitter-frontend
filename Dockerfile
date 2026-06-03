# all from docs.docker.com/guides/angular/containerize btw

FROM dhi.io/node:24-alpine3.22-dev AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build 

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================

FROM dhi.io/nginx:1.28.0-alpine3.21-dev AS runner

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]