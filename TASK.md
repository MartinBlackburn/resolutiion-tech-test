# Project Brief

Build a "Team Task Board" application where users can create, update, and organize tasks.

## Requirements

### Backend (Node.js + Express/NestJS)

Expose a REST (or GraphQL) API with endpoints to:

-   ✅ Create a task
-   ✅ Update a task (title, description, status)
-   ✅ Delete a task
-   ✅ List all tasks

Each task should have: id, title, description, and status (todo, in-progress, done).
Use a simple database (SQLite, Postgres, or MongoDB).

### Frontend (React/Next.js)

Display a task board (like a simplified Trello):

-   Columns for todo, in-progress, and done.
-   Tasks should appear under the correct column based on status.

Provide UI to:

-   Add a task
-   Edit a task
-   Delete a task
-   Drag and drop tasks between columns (updates backend).

Use TypeScript throughout and show proper typing (no any).

## Extra Credit (Optional)

-   Add search/filter for tasks.
-   Implement basic optimistic updates with React Query (or equivalent).
-   Write one or two simple tests (backend route test or frontend component test).
-   ✅ Containerize with Docker for easy run.

## Clarifications

You can use NextJS as your full-stack framework if you so wish OR you can seperate out your frontend and backend.
Use whatever approach you think is appropriate for the task

Please keep the code to 1 repository regardless of the way you choose to architect it
