// types
import { Task as TaskType } from "@/types/task";

interface ICreateTasksProps {
    task: TaskType;
    onError: (error: string) => void;
    onSuccess: () => void;
}

export const createTask = async (props: ICreateTasksProps) => {
    console.log("task", props.task);
    try {
        const response = await fetch("http://localhost:3001/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(props.task),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        props.onSuccess();
    } catch (err) {
        console.error("Error creating task:", err);

        props.onError("Error creating task");
    }
};
