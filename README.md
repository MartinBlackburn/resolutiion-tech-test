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

## NOTES

### Trade offs

-   The data validators for the input are very basic, given more time these would return a reason why the validation failed and used to display a better error to the user.
-   The input isn't sanitised very well and relies on Prisma doing it, it could be manually sanitised for better security.
-   Database is using SQLlite, this was done for speed, and so I could commit is to the project with some example data.

### Improvements

-   sorting of the tasks on the board
    -   this would need a ordinal storing in the database and updating as needed
-   better error messaging, currently there is only server side validation of the task data, this could also be done client side and show a better error to the user
-   confirmation when deleting a task
-   the optimistic updates are very basic - the tasks are fetched after an create/update, without a library. Given more time I would use Redux or React Query to manage this in a much nicer way
-   use a monorepo setup (Lerna, Turborepo, NX, etc), so the two apps can be versioned and deployed separately
-   better unit test coverage, I've only tested one component, one API util and part of the backend routes
-   filtering: this only filters on title, but could also filter via description. Rather then hiding the tasks completely, the filter could change teh style and fade the tasks
