FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

RUN mkdir -p /app/data

RUN chown -R bun:bun /app/data
USER bun

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
