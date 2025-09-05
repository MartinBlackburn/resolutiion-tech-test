// libraries
import express from "express";
import cors from "cors";

// routes
import { getTask } from "./routes/getTask";
import { createTask } from "./routes/createTask";
import { updateTask } from "./routes/updateTask";
import { deleteTask } from "./routes/deleteTask";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * GET /api/tasks
 * Returns all tasks
 */
app.get("/api/tasks", getTask);

/**
 * POST /api/tasks
 * Creates a new task
 */
app.post("/api/tasks", createTask);

/**
 * PUT /api/tasks/:id
 * Updates a task
 */
app.put("/api/tasks/:id", updateTask);

/**
 * DELETE /api/tasks/:id
 * Deletes a task
 */
app.delete("/api/tasks/:id", deleteTask);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
