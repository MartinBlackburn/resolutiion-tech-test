"use client";

// libraries
import { useEffect, useState, Fragment, useCallback } from "react";

// components
import Board from "@/components/Board";
import CreateTask from "@/components/CreateTask";
import ErrorNotification from "@/components/ErrorNotification";

// utils
import { fetchTasks } from "@/utils/fetchTasks";
import { createTask } from "@/utils/createTask";

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

    const handleCreateTask = (task: TaskType) => {
        createTask({
            task: task,
            onError: (message) => addError(message),
            onSuccess: () => {
                setCreateTaskModal(false);
                fetchTasks({
                    onError: (message) => addError(message),
                    onSuccess: (tasks) => {
                        setTasks(tasks);
                    },
                });
            },
        });
    };

    useEffect(() => {
        fetchTasks({
            onError: (message) => addError(message),
            onSuccess: (tasks) => {
                setTasks(tasks);
                setLoading(false);
            },
        });
    }, [addError]);

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
            fetchTasks({
                onError: (message) => addError(message),
                onSuccess: (tasks) => {
                    setTasks(tasks);
                    setLoading(false);
                },
            });
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
            {createTaskModal && <CreateTask createTask={handleCreateTask} />}
        </Fragment>
    );
};

export default Home;
