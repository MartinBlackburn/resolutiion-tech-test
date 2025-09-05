"use client";

// libraries
import React from "react";
import { useDroppable } from "@dnd-kit/core";

// components
import TaskComponent from "@/components/Task";

// types
import { Task, TaskStatus } from "@/types/task";

// styles
import "./styles.css";

interface IProps {
    status: TaskStatus;
    title: string;
    tasks: Task[];
    onEdit: (taskId: Task) => void;
    onDelete: (taskId: Task) => void;
}

const Column: React.FC<IProps> = (props: IProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.status,
    });

    return (
        <div ref={setNodeRef} className={`column ${isOver ? "column--drag-over" : ""}`} data-status={props.status}>
            <h2 className="column__title">{props.title}</h2>

            <div className="column__content">
                {props.tasks.map((task) => (
                    <TaskComponent
                        key={task.id}
                        id={task.id!}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        createdAt={task.createdAt!}
                        onEdit={() => props.onEdit(task)}
                        onDelete={() => props.onDelete(task)}
                    />
                ))}

                {props.tasks.length === 0 && (
                    <div className="column__empty-state">No tasks in {props.title.toLowerCase()}</div>
                )}
            </div>
        </div>
    );
};

export default Column;
