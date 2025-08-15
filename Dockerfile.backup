# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables to suppress deprecation warnings
ENV NODE_OPTIONS="--no-deprecation"
ENV NODE_ENV=production

# Copy package files first
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install ALL dependencies (including devDependencies for build)
RUN npm install --production=false
RUN cd server && npm install --production=false
RUN cd client && npm install --production=false

# Copy source code
COPY . .

# Build the application (only after all dependencies are installed)
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production
RUN cd server && npm prune --production
RUN cd client && npm prune --production

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
