"use client";

// libraries
import { useEffect, useState, Fragment, useCallback } from "react";

// components
import Board from "@/components/Board";
import CreateTask from "@/components/CreateTask";
import ErrorNotification from "@/components/ErrorNotification";

// types
import { Task as TaskType, TaskStatus } from "@/types/task";

const Home = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);

    const addError = useCallback(
        (error: string) => {
            setErrors([...errors, error]);
        },
        [errors]
    );

    const fetchTasks = useCallback(async () => {
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

            addError("Error fetching tasks");
        }
    }, [addError]);

    const createTask = useCallback(
        async (task: TaskType) => {
            try {
                const response = await fetch("http://localhost:3001/api/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(task),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (err) {
                console.error("Error creating task:", err);

                addError("Error creating task");
            } finally {
                fetchTasks();
                setCreateTaskModal(false);
            }
        },
        [addError, fetchTasks]
    );

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (errors.length > 0) {
            setTimeout(() => {
                errors.pop();
                setErrors([...errors]);
            }, 3000);
        }
    }, [errors]);

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

            addError("Error moving task");
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

    return (
        <Fragment>
            <div className="homePage__controls">
                <button onClick={() => setCreateTaskModal(true)}>Create task</button>
            </div>
            <Board tasks={tasks} onTaskStatusUpdate={handleTaskStatusUpdate} />;
            <ErrorNotification errors={errors} />
            {createTaskModal && <CreateTask createTask={createTask} />}
        </Fragment>
    );
};

export default Home;
