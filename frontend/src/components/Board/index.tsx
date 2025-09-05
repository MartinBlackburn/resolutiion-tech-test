"use client";

// libraries
import React from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

// components
import Column from "@/components/Column";

// types
import { Task as TaskType, TaskStatus } from "@/types/task";

// styles
import "./styles.css";

interface IProps {
    tasks: TaskType[];
    onTaskStatusUpdate: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const Board: React.FC<IProps> = ({ tasks, onTaskStatusUpdate }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const getTasksByStatus = (status: TaskStatus): TaskType[] => {
        return tasks.filter((task) => task.status === status);
    };

    const todoTasks = getTasksByStatus("TODO");
    const inProgressTasks = getTasksByStatus("INPROGRESS");
    const doneTasks = getTasksByStatus("DONE");

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as TaskStatus;

        // Find the current task
        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask || currentTask.status === newStatus) {
            return; // No change needed
        }

        try {
            await onTaskStatusUpdate(taskId, newStatus);
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="board">
                <Column status="TODO" title="To Do" tasks={todoTasks} />
                <Column status="INPROGRESS" title="In Progress" tasks={inProgressTasks} />
                <Column status="DONE" title="Done" tasks={doneTasks} />
            </div>
        </DndContext>
    );
};

export default Board;
