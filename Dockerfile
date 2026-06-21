# 1. Build the React Frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Setup the Production Node.js Environment
FROM node:20-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install only production dependencies (Express, CORS, etc.)
RUN npm ci --omit=dev
# Copy the compiled React frontend from the builder stage
COPY --from=builder /app/dist ./dist
# Copy the backend Express server
COPY server ./server

# Cloud Run automatically sets the PORT environment variable
EXPOSE 3001

# Start the Express server (which now serves the API + frontend)
CMD ["npm", "run", "start"]
