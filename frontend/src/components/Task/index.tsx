"use client";

// libraries
import React from "react";
import { useDraggable } from "@dnd-kit/core";

// types
import { TaskStatus } from "@/types";

// utils
import { formatDate } from "@/utils/date";

// styles
import "./styles.css";

interface IProps {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string | Date;
    onEdit: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

const Task: React.FC<IProps> = (props: IProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: props.id,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(5deg)`,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`task ${isDragging ? "task--dragging" : ""}`}
            {...{ ...listeners, ...attributes }}
        >
            <h3 className="task__title">{props.title}</h3>

            <p className="task__description">{props.description}</p>

            <time className="task__date" dateTime={formatDate(props.createdAt)}>
                Created: {formatDate(props.createdAt)}
            </time>

            <div className="task__actions">
                <button onClick={() => props.onEdit(props.id)}>Edit</button>
                <button className="delete" onClick={() => props.onDelete(props.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Task;
