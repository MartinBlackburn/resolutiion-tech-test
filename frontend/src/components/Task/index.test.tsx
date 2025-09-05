// libraries
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDraggable } from "@dnd-kit/core";
import "@testing-library/jest-dom";

// types
import { TaskStatus } from "@/types";

// things to test
import Task from "./index";

// Mock the @dnd-kit/core module
jest.mock("@dnd-kit/core", () => ({
    useDraggable: jest.fn(() => ({
        attributes: { "data-testid": "draggable" },
        listeners: { onPointerDown: jest.fn() },
        setNodeRef: jest.fn(),
        transform: null,
        isDragging: false,
    })),
}));

// Mock the date utility
jest.mock("@/utils/date", () => ({
    formatDate: jest.fn((date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }),
}));

describe("Task Component", () => {
    const mockTask = {
        id: "task-1",
        title: "Test Task",
        description: "This is a test task description",
        status: "TODO" as TaskStatus,
        createdAt: "2024-01-15T10:30:00Z",
    };

    const mockProps = {
        onEdit: jest.fn(),
        onDelete: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders task information correctly", () => {
            render(<Task {...mockTask} {...mockProps} />);

            expect(screen.getByText("Test Task")).toBeInTheDocument();
            expect(screen.getByText("This is a test task description")).toBeInTheDocument();
            expect(screen.getByText(/Created:/)).toBeInTheDocument();
        });

        it("renders with correct CSS classes", () => {
            render(<Task {...mockTask} {...mockProps} />);

            const taskElement = screen.getByText("Test Task").closest(".task");
            expect(taskElement).toBeInTheDocument();
            expect(taskElement).toHaveClass("task");
        });

        it("renders edit and delete buttons", () => {
            render(<Task {...mockTask} {...mockProps} />);

            expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        });

        it("renders time element with correct dateTime attribute", () => {
            render(<Task {...mockTask} {...mockProps} />);

            const timeElement = screen.getByText(/Created:/).closest("time");
            expect(timeElement).toBeInTheDocument();
            expect(timeElement).toHaveAttribute("dateTime");
        });

        it("handles different task statuses", () => {
            const inProgressProps = { ...mockProps, status: "INPROGRESS" as TaskStatus };
            const doneProps = { ...mockProps, status: "DONE" as TaskStatus };

            const { rerender } = render(<Task {...mockTask} {...inProgressProps} />);
            expect(screen.getByText("Test Task")).toBeInTheDocument();

            rerender(<Task {...mockTask} {...doneProps} />);
            expect(screen.getByText("Test Task")).toBeInTheDocument();
        });

        it("handles Date object for createdAt", () => {
            const dateProps = { ...mockProps, createdAt: new Date("2024-01-15T10:30:00Z") };
            render(<Task {...mockTask} {...dateProps} />);

            expect(screen.getByText(/Created:/)).toBeInTheDocument();
        });

        it("handles string date for createdAt", () => {
            const stringDateProps = { ...mockTask, ...mockProps, createdAt: "2024-01-15T10:30:00Z" };
            render(<Task {...stringDateProps} />);

            expect(screen.getByText(/Created:/)).toBeInTheDocument();
        });
    });

    describe("Edit button", () => {
        it("calls onEdit when edit button is clicked", () => {
            render(<Task {...mockTask} {...mockProps} />);

            const editButton = screen.getByRole("button", { name: "Edit" });
            fireEvent.click(editButton);

            expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
        });
    });

    describe("Delete button", () => {
        it("calls onDelete with correct task id when delete button is clicked", () => {
            render(<Task {...mockTask} {...mockProps} />);

            const deleteButton = screen.getByRole("button", { name: "Delete" });
            fireEvent.click(deleteButton);

            expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
            expect(mockProps.onDelete).toHaveBeenCalledWith("task-1");
        });

        it("applies delete class to delete button", () => {
            render(<Task {...mockTask} {...mockProps} />);

            const deleteButton = screen.getByRole("button", { name: "Delete" });
            expect(deleteButton).toHaveClass("delete");
        });
    });

    describe("Drag and drop", () => {
        it("applies dragging class when isDragging is true", () => {
            (useDraggable as jest.Mock).mockReturnValue({
                attributes: { "data-testid": "draggable" },
                listeners: { onPointerDown: jest.fn() },
                setNodeRef: jest.fn(),
                transform: null,
                isDragging: true,
            });

            render(<Task {...mockTask} {...mockProps} />);

            const taskElement = screen.getByText("Test Task").closest(".task");
            expect(taskElement).toHaveClass("task--dragging");
        });

        it("applies transform style when transform is provided", () => {
            (useDraggable as jest.Mock).mockReturnValue({
                attributes: { "data-testid": "draggable" },
                listeners: { onPointerDown: jest.fn() },
                setNodeRef: jest.fn(),
                transform: { x: 10, y: 20 },
                isDragging: false,
            });

            render(<Task {...mockTask} {...mockProps} />);

            const taskElement = screen.getByText("Test Task").closest(".task");
            expect(taskElement).toHaveStyle("transform: translate3d(10px, 20px, 0) rotate(5deg)");
        });

        it("passes draggable attributes and listeners to task element", () => {
            const mockAttributes = { "data-testid": "draggable" };
            const mockListeners = { onPointerDown: jest.fn() };

            (useDraggable as jest.Mock).mockReturnValue({
                attributes: mockAttributes,
                listeners: mockListeners,
                setNodeRef: jest.fn(),
                transform: null,
                isDragging: false,
            });

            render(<Task {...mockTask} {...mockProps} />);

            const taskElement = screen.getByText("Test Task").closest(".task");
            expect(taskElement).toHaveAttribute("data-testid", "draggable");
        });
    });
});
