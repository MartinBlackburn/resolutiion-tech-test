import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { Prisma } from "@prisma/client";
import { validTitle, validDescription, validStatus } from "./lib/validators";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * GET /api/tasks
 * Returns all tasks
 */
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
        });

        return res.json(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * POST /api/tasks
 * Creates a new task
 */
app.post("/api/tasks", async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!validTitle(title)) {
            return res.status(400).json({ error: "Invalid title" });
        }

        if (!validDescription(description)) {
            return res.status(400).json({ error: "Invalid description" });
        }

        if (!validStatus(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const createdTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
            },
        });

        return res.status(201).json(createdTask);
    } catch (error) {
        console.error("Failed to create task:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * PUT /api/tasks/:id
 * Updates a task
 */
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        if (title && !validTitle(title)) {
            return res.status(400).json({ error: "Invalid title" });
        }

        if (description && !validDescription(description)) {
            return res.status(400).json({ error: "Invalid description" });
        }

        if (status && !validStatus(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
            },
        });

        return res.json(updatedTask);
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return res.status(404).json({ error: "Task not found" });
        }

        console.error("Failed to update task:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task
 */
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({ where: { id } });

        return res.status(204).send();
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return res.status(404).json({ error: "Task not found" });
        }

        console.error("Failed to delete task:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
