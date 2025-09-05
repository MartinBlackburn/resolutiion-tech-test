// libraries
import { prisma } from "../lib/prisma";

// types
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

// validators
import { validTitle, validDescription, validStatus } from "../lib/validators";

export const updateTask = async (req: Request, res: Response) => {
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
};
