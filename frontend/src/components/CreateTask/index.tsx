"use client";

// libraries
import React, { useState } from "react";

// types
import { TaskStatus, Task as TaskType } from "@/types/task";

// styles
import "./styles.css";

interface IProps {
    task?: TaskType;
    updateTask: (taskId: string, task: TaskType) => void;
    createTask: (task: TaskType) => void;
}

const CreateTask: React.FC<IProps> = (props: IProps) => {
    const [title, setTitle] = useState(props.task?.title || "");
    const [description, setDescription] = useState(props.task?.description || "");
    const [status, setStatus] = useState(props.task?.status || "TODO");

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (props.task) {
            props.updateTask(props.task.id!, { title, description, status: status as TaskStatus });
        } else {
            props.createTask({ title, description, status: status as TaskStatus });
        }
    };

    return (
        <div className="createTask">
            <div className="createTask__inner">
                <h3 className="createTask__title">{props.task ? "Edit task" : "Create task"}</h3>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={50}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                />

                <select
                    className="createTask__status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                    <option value="TODO">To do</option>
                    <option value="INPROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                </select>

                <button onClick={(event) => handleSubmit(event)} className="createTask__button">
                    {props.task ? "Update" : "Create"}
                </button>
            </div>
        </div>
    );
};

export default CreateTask;
