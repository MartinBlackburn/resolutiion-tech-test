// types
import { Task as TaskType } from "@/types/task";

interface IUpdateTasksProps {
    taskId: string;
    task: TaskType;
    onError: (error: string) => void;
    onSuccess: (task: TaskType) => void;
}

export const updateTask = async (props: IUpdateTasksProps) => {
    try {
        const response = await fetch(`http://localhost:3001/api/tasks/${props.taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(props.task),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTask = await response.json();

        props.onSuccess(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);

        props.onError("Error updating task");
    }
};
