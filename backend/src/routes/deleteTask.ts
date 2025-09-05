// libraries
import { prisma } from "../lib/prisma";

// types
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedTask = await prisma.task.delete({ where: { id } });

        return res.status(204).send(deletedTask);
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return res.status(404).json({ error: "Task not found" });
        }

        console.error("Failed to delete task:", error);

        return res.status(500).json({ error: "Internal server error" });
    }
};
