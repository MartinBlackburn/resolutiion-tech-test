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
import { updateTask } from "@/utils/updateTask";
import { deleteTask } from "@/utils/deleteTask";

// types
import { Task as TaskType } from "@/types/task";

const Home = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [taskModal, setTaskModal] = useState<boolean>(false);
    const [editTask, setEditTask] = useState<TaskType>();

    const addError = useCallback(
        (error: string) => {
            setErrors([...errors, error]);
        },
        [errors]
    );

    const handleCreateTask = async (task: TaskType) => {
        await createTask({
            task: task,
            onError: (message) => addError(message),
            onSuccess: () => {
                setTaskModal(false);
                fetchTasks({
                    onError: (message) => addError(message),
                    onSuccess: (tasks) => {
                        setTasks(tasks);
                    },
                });
            },
        });
    };

    const handleUpdateTask = async (taskId: string, task: TaskType) => {
        await updateTask({
            taskId: taskId,
            task: task,
            onError: (message) => addError(message),
            onSuccess: (updatedTask) => {
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task))
                );
                setTaskModal(false);
                fetchTasks({
                    onError: (message) => addError(message),
                    onSuccess: (tasks) => {
                        setTasks(tasks);
                    },
                });
            },
        });
    };

    // fetch the tasks on mount
    useEffect(() => {
        fetchTasks({
            onError: (message) => addError(message),
            onSuccess: (tasks) => {
                setTasks(tasks);
                setLoading(false);
            },
        });
    }, [addError]);

    // remove errors after 3 seconds
    useEffect(() => {
        if (errors.length > 0) {
            setTimeout(() => {
                errors.pop();
                setErrors([...errors]);
            }, 3000);
        }
    }, [errors]);

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
                <button onClick={() => setTaskModal(true)}>Create task</button>
            </div>

            <Board
                tasks={tasks}
                onTaskStatusUpdate={handleUpdateTask}
                onTaskEdit={(task) => {
                    setEditTask(task);
                    setTaskModal(true);
                }}
                onTaskDelete={(taskId) => {
                    deleteTask({
                        taskId,
                        onError: (message) => addError(message),
                        onSuccess: () => {
                            fetchTasks({
                                onError: (message) => addError(message),
                                onSuccess: (tasks) => {
                                    setTasks(tasks);
                                },
                            });
                        },
                    });
                }}
            />

            <ErrorNotification errors={errors} />

            {taskModal && <CreateTask updateTask={handleUpdateTask} createTask={handleCreateTask} task={editTask} />}
        </Fragment>
    );
};

export default Home;
