FROM node:14-alpine AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npx tsc --outDir ./dist

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 5000
CMD ["node", "dist/index.js"]