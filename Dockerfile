FROM oven/bun AS build

WORKDIR /app
COPY . /app/
RUN bun install
RUN bun vite build --outDir /app/build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf