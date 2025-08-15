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

# Install root dependencies
RUN npm install

# Install server dependencies
RUN cd server && npm install

# Install client dependencies
RUN cd client && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
