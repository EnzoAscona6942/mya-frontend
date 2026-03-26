FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignore postinstall - prisma generate runs after prisma is copied)
RUN npm ci --omit=dev --ignore-scripts

# Copy prisma files
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source
COPY src ./src/

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]