FROM node:22-slim

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Expose port
EXPOSE 3001

# Start the application in development mode
CMD ["npm", "run", "dev"]
