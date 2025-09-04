# Resolutiion

A full-stack monorepo application with Next.js frontend and Express.js backend.

## Prerequisites

-   Node.js 22+ (use nvm to manage versions)
-   Docker & Docker Compose (optional, for containerized development)

## Node Version Management (NVM)

This project uses Node.js 22. Use nvm to install and switch to the correct version:

```bash
# Install Node.js 22 (if not already installed)
nvm install 22

# Use Node.js 22 for this project
nvm use 22

# Verify version
node --version  # Should show v22.x.x
```

## Project Structure

```
root/
├── frontend/          # Next.js application with TypeScript
├── backend/           # Express.js API with Prisma
├── docker-compose.yml # Docker orchestration
├── .nvmrc             # Node version specification
└── README.md          # You are here :)
```

## Tech Stack

### Frontend

-   Next.js 15 (App Router)
-   TypeScript
-   ESLint

### Backend

-   Express.js
-   TypeScript
-   Prisma ORM
-   SQLite

### Infrastructure

-   Docker & Docker Compose
-   SQLite database

## Quick Start

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd resolutiion
    ```

2. Set up Node.js version:

    ```bash
    nvm use
    ```

3. Start all services with Docker Compose:

    ```bash
    docker compose up --build
    ```

4. Access the applications:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:3001

## Development

-   `docker compose up` - Start all services
-   `docker compose up --build` - Rebuild and start services, when dependencies change

## Environment Variables

These are all defined in the docker compose, but should ideally be moved to a .env file for production

### Frontend

-   `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

### Backend

-   `NODE_ENV` - Environment (development/production)
-   `PORT` - Server port (default: 3001)
-   `DATABASE_URL` - SQLite connection string (file:./dev.db)

## API Endpoints

-   `GET /` - Health check
-   `GET /api/health` - API health status
