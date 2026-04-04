FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock
RUN bun i --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27.3-alpine

COPY --from=build /app/build /var/www/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]
