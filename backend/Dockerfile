# backend/Dockerfile

FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Expose the port NestJS runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
