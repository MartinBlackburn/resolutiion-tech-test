// libraries
import "@testing-library/jest-dom";

// types
import { Task as TaskType } from "@/types/task";

// things to test
import { fetchTasks } from "./fetchTasks";

// Mock fetch globally
global.fetch = jest.fn();

describe("fetchTasks", () => {
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

    const mockProps = {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
    };

    const mockTasks: TaskType[] = [
        {
            id: "1",
            title: "Test Task 1",
            description: "Description 1",
            status: "TODO",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        {
            id: "2",
            title: "Test Task 2",
            description: "Description 2",
            status: "INPROGRESS",
            createdAt: "2024-01-02T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    describe("Successful API calls", () => {
        it("should call onSuccess with tasks data when API call is successful", async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockTasks),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/api/tasks");
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockOnSuccess).toHaveBeenCalledTimes(1);
            expect(mockOnSuccess).toHaveBeenCalledWith(mockTasks);
            expect(mockOnError).not.toHaveBeenCalled();
        });

        it("should handle empty tasks array", async () => {
            const emptyTasks: TaskType[] = [];
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(emptyTasks),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnSuccess).toHaveBeenCalledWith(emptyTasks);
            expect(mockOnError).not.toHaveBeenCalled();
        });
    });

    describe("HTTP error responses", () => {
        it("should call onError when response is not ok (404)", async () => {
            const mockResponse = {
                ok: false,
                status: 404,
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
            expect(mockOnSuccess).not.toHaveBeenCalled();
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetching tasks:", expect.any(Error));
        });

        it("should call onError when response is not ok (500)", async () => {
            const mockResponse = {
                ok: false,
                status: 500,
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
            expect(mockOnSuccess).not.toHaveBeenCalled();
        });
    });

    describe("Network and parsing errors", () => {
        it("should call onError when fetch throws a network error", async () => {
            const networkError = new Error("Network error");
            (global.fetch as jest.Mock).mockRejectedValue(networkError);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
            expect(mockOnSuccess).not.toHaveBeenCalled();
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetching tasks:", networkError);
        });

        it("should call onError when response.json() throws an error", async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
            expect(mockOnSuccess).not.toHaveBeenCalled();
            expect(mockConsoleError).toHaveBeenCalledWith("Error fetching tasks:", expect.any(Error));
        });

        it("should call onError when fetch is undefined or throws TypeError", async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
            expect(mockOnSuccess).not.toHaveBeenCalled();
        });
    });

    describe("Callback behavior", () => {
        it("should only call onSuccess once on successful request", async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockTasks),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnSuccess).toHaveBeenCalledTimes(1);
            expect(mockOnError).toHaveBeenCalledTimes(0);
        });

        it("should only call onError once on failed request", async () => {
            const mockResponse = {
                ok: false,
                status: 500,
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledTimes(1);
            expect(mockOnSuccess).toHaveBeenCalledTimes(0);
        });

        it("should pass the exact error message to onError", async () => {
            const mockResponse = {
                ok: false,
                status: 404,
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await fetchTasks(mockProps);

            expect(mockOnError).toHaveBeenCalledWith("Error fetching tasks");
        });
    });
});
