// libraries
import { prisma } from "../lib/prisma";

// types
import { Request, Response } from "express";

export const getTask = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
        });

        return res.json(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
};
