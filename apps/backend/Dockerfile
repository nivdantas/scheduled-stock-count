FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json ./

COPY packages/database/package.json ./packages/database/
COPY packages/database/package.json ./packages/tsconfig/

COPY apps/backend/package.json ./apps/backend/

COPY packages/database ./packages/database
COPY packages/tsconfig ./packages/tsconfig
RUN bun install --no-save


WORKDIR /app/packages/database

ENV DATABASE_URL="postgresql://user:password@postgres:5432/stockdb?schema=public"

RUN bunx prisma generate

WORKDIR /app/apps/backend

COPY apps/backend .

EXPOSE 3000

CMD ["bun", "run", "dev"]
