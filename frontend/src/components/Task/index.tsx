// libraries
import React from "react";

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
}

const Task: React.FC<IProps> = (props: IProps) => {
    return (
        <div className="task">
            <h3 className="task__title">{props.title}</h3>

            <p className="task__description">{props.description}</p>

            <time className="task__date" dateTime={formatDate(props.createdAt)}>
                Created: {formatDate(props.createdAt)}
            </time>
        </div>
    );
};

export default Task;
