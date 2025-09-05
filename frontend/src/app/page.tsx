"use client";

// libraries
import { useEffect, useState } from "react";

// components
import Board from "@/components/Board";

// types
import { Task as TaskType, TaskStatus } from "@/types/task";

const Home = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/tasks");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setTasks(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedTask = await response.json();

            // Update the task in the local state
            // if an error happens, the task will be reverted to the previous state by the
            // fetchTasks in the finally block
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)));
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            // refetch the tasks
            // more useful on error to undo the change, but also fetches the latest changes
            fetchTasks();
        }
    };

    if (loading) {
        return (
            <div className="homePage">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homePage">
                <p>Error loading tasks: {error}</p>
            </div>
        );
    }

    return <Board tasks={tasks} onTaskStatusUpdate={handleTaskStatusUpdate} />;
};

export default Home;
