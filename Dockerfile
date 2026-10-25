FROM mcr.microsoft.com/playwright:v1.64.1-noble
RUN npm i -g pnpm@10.33.2
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
