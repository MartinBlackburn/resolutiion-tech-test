"use client";

// libraries
import React, { useState } from "react";

// types
import { TaskStatus, Task as TaskType } from "@/types/task";

// styles
import "./styles.css";

interface IProps {
    createTask: (task: TaskType) => void;
}

const CreateTask: React.FC<IProps> = (props: IProps) => {
    const { createTask } = props;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        createTask({ title, description, status: status as TaskStatus });
    };

    return (
        <div className="createTask">
            <div className="createTask__inner">
                <h3 className="createTask__title">Create task</h3>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select className="createTask__status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="TODO">To do</option>
                    <option value="INPROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                </select>

                <button onClick={(event) => handleSubmit(event)} className="createTask__button">
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateTask;
