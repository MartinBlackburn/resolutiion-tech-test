import { Prisma, Status as PrismaStatus } from "@prisma/client";

export type CreateTaskPayload = {
    title: string;
    description: string;
    status: string;
};

export type UpdateTaskPayload = {
    title?: string;
    description?: string;
    status?: string;
};

export const validTitle = (value: string) => {
    if (!value) {
        return false;
    }

    if (typeof value !== "string" || value.length === 0) {
        return false;
    }

    if (value.length > 50) {
        return false;
    }

    return true;
};

export const validDescription = (value: string) => {
    if (!value) {
        return false;
    }

    if (typeof value !== "string" || value.length === 0) {
        return false;
    }

    if (value.length > 255) {
        return false;
    }

    return true;
};

export const validStatus = (value: string) => {
    if (!value) {
        return false;
    }

    if (typeof value !== "string" || value.length === 0) {
        return false;
    }

    const allowedStatuses = Object.values(PrismaStatus);
    if (!allowedStatuses.includes(value as PrismaStatus)) {
        return false;
    }

    return true;
};
