"use client";

// libraries
import { useEffect, useState } from "react";

// components
import Board from "@/components/Board";

// types
import { Task as TaskType } from "@/types/task";

const Home = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        fetchTasks();
    }, []);

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

    return <Board tasks={tasks} />;
};

export default Home;
