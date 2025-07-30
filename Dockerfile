FROM node:18-alpine3.19 AS runner
RUN apk update && apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]