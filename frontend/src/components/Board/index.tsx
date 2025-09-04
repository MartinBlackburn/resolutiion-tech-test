// libraries
import React from "react";

// components
import Task from "@/components/Task";

// types
import { Task as TaskType, TaskStatus } from "@/types/task";

// styles
import "./styles.css";

interface IProps {
    tasks: TaskType[];
}

const TodoBoard: React.FC<IProps> = ({ tasks }) => {
    const getTasksByStatus = (status: TaskStatus): TaskType[] => {
        return tasks.filter((task) => task.status === status);
    };

    const todoTasks = getTasksByStatus("TODO");
    const inProgressTasks = getTasksByStatus("INPROGRESS");
    const doneTasks = getTasksByStatus("DONE");

    return (
        <div className="board">
            <div className="board__column">
                <h2 className="board__column-title">TODO</h2>

                <div className="board__column-content">
                    {todoTasks.map((task) => (
                        <Task
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            createdAt={task.createdAt}
                        />
                    ))}
                    {todoTasks.length === 0 && <div className="board__empty-state">No tasks in TODO</div>}
                </div>
            </div>

            <div className="board__column">
                <h2 className="board__column-title">IN PROGRESS</h2>
                <div className="board__column-content">
                    {inProgressTasks.map((task) => (
                        <Task
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            createdAt={task.createdAt}
                        />
                    ))}

                    {inProgressTasks.length === 0 && <div className="board__empty-state">No tasks in progress</div>}
                </div>
            </div>

            <div className="board__column">
                <h2 className="board__column-title">DONE</h2>
                <div className="board__column-content">
                    {doneTasks.map((task) => (
                        <Task
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            createdAt={task.createdAt}
                        />
                    ))}

                    {doneTasks.length === 0 && <div className="board__empty-state">No completed tasks</div>}
                </div>
            </div>
        </div>
    );
};

export default TodoBoard;
