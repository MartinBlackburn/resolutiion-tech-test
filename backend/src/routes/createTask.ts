// libraries
import { prisma } from "../lib/prisma";

// types
import { Request, Response } from "express";

// validators
import { validTitle, validDescription, validStatus } from "../lib/validators";

export const createTask = async (req: Request, res: Response) => {
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
};
