# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Start the application
CMD ["npm", "start"]
