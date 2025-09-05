export type TaskStatus = "TODO" | "INPROGRESS" | "DONE";

export interface Task {
    id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
