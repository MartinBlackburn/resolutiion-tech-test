interface IDeleteTasksProps {
    taskId: string;
    onError: (error: string) => void;
    onSuccess: () => void;
}

export const deleteTask = async (props: IDeleteTasksProps) => {
    try {
        const response = await fetch(`http://localhost:3001/api/tasks/${props.taskId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        props.onSuccess();
    } catch (error) {
        console.error("Error deleting task:", error);

        props.onError("Error deleting task");
    }
};
