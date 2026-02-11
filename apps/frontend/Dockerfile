FROM oven/bun:1 as base
WORKDIR /app

COPY package.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/tsconfig/package.json ./packages/tsconfig/

COPY apps/frontend/package.json ./apps/frontend/

COPY packages/database ./packages/database
COPY packages/tsconfig ./packages/tsconfig

RUN bun install --no-save


WORKDIR /app/packages/database

ENV DATABASE_URL="postgresql://user:password@postgres:5432/stockdb?schema=public"

RUN bunx prisma generate

WORKDIR /app/apps/frontend
COPY apps/frontend ./

RUN bun run build

EXPOSE 3001

CMD ["bun", "run", "start"]
