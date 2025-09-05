// types
import { Task as TaskType } from "@/types/task";

interface IFetchTasksProps {
    onError: (error: string) => void;
    onSuccess: (tasks: TaskType[]) => void;
}

export const fetchTasks = async (props: IFetchTasksProps) => {
    try {
        const response = await fetch("http://localhost:3001/api/tasks");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TaskType[] = await response.json();

        props.onSuccess(data);
    } catch (err) {
        console.error("Error fetching tasks:", err);

        props.onError("Error fetching tasks");
    }
};
