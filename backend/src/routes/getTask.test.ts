import { Request, Response } from "express";
import { getTask } from "./getTask";
import { prisma } from "../lib/prisma";

// Mock Prisma client
jest.mock("../lib/prisma", () => ({
    prisma: {
        task: {
            findMany: jest.fn(),
        },
    },
}));

// Mock console.error to avoid noise in test output
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("getTask", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();

        mockRequest = {};
        mockResponse = {
            json: mockJson,
            status: mockStatus,
        };

        jest.clearAllMocks();
        mockConsoleError.mockClear();
    });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    describe("successful cases", () => {
        it("should return all tasks successfully", async () => {
            const mockTasks = [
                {
                    id: "1",
                    title: "Test Task 1",
                    description: "Test Description 1",
                    status: "TODO",
                    createdAt: new Date("2024-01-01T00:00:00.000Z"),
                    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
                },
                {
                    id: "2",
                    title: "Test Task 2",
                    description: "Test Description 2",
                    status: "IN_PROGRESS",
                    createdAt: new Date("2024-01-02T00:00:00.000Z"),
                    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
                },
            ];

            (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
            expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith(mockTasks);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it("should return empty array when no tasks exist", async () => {
            (prisma.task.findMany as jest.Mock).mockResolvedValue([]);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
            expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith([]);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it("should call prisma with correct parameters", async () => {
            (prisma.task.findMany as jest.Mock).mockResolvedValue([]);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
        });
    });

    describe("error cases", () => {
        it("should return 500 error when database fails", async () => {
            const mockError = new Error("Database connection failed");
            (prisma.task.findMany as jest.Mock).mockRejectedValue(mockError);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
            expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
            expect(mockConsoleError).toHaveBeenCalledWith("Failed to fetch tasks:", mockError);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Internal server error" });
        });

        it("should handle prisma validation errors", async () => {
            const mockError = new Error("Invalid query parameters");
            (prisma.task.findMany as jest.Mock).mockRejectedValue(mockError);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(mockConsoleError).toHaveBeenCalledWith("Failed to fetch tasks:", mockError);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Internal server error" });
        });

        it("should handle unexpected errors", async () => {
            const mockError = new Error("Unexpected error");
            (prisma.task.findMany as jest.Mock).mockRejectedValue(mockError);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(mockConsoleError).toHaveBeenCalledWith("Failed to fetch tasks:", mockError);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Internal server error" });
        });
    });

    describe("edge cases", () => {
        it("should handle null response from prisma", async () => {
            (prisma.task.findMany as jest.Mock).mockResolvedValue(null);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
            expect(mockJson).toHaveBeenCalledWith(null);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it("should handle undefined response from prisma", async () => {
            (prisma.task.findMany as jest.Mock).mockResolvedValue(undefined);

            await getTask(mockRequest as Request, mockResponse as Response);

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
            expect(mockJson).toHaveBeenCalledWith(undefined);
            expect(mockStatus).not.toHaveBeenCalled();
        });
    });
});
