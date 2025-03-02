import { Task, BoardAction } from "@/types";
import { useState, useRef } from "react";
import TaskItem from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
    boardId: string;
    boardActions: BoardAction;
}

export default function TaskList({
    tasks,
    boardId,
    boardActions
}: TaskListProps) {
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [dropPosition, setDropPosition] = useState<{
        taskId: string | undefined;
        position: "before" | "after";
    } | null>(null);

    const draggedTaskRef = useRef<HTMLDivElement | null>(null);

    const handleTaskDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task
    ) => {
        e.stopPropagation();
        setDraggedTask(task);
        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "0.5";
        }
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
                taskId: task.id,
                sourceBoardId: boardId,
                task
            })
        );
    };

    const handleTaskDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "1";
        }
        setDraggedTask(null);

        if (e.dataTransfer.dropEffect === "none") {
            console.log("태스크 드래그 앤 드롭 실패");
        }
    };

    const handleTaskDragOver = (
        e: React.DragEvent<HTMLDivElement>,
        task?: Task
    ) => {
        e.preventDefault();
        e.stopPropagation();
        // e.dataTransfer.dropEffect = "move";
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const position = y < rect.height / 2 ? "before" : "after";
        if (draggedTask?.id !== task?.id) {
            setDropPosition({ taskId: task?.id, position });
        }
    };

    const handleTaskDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDropPosition(null);
    };

    const handleTaskDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetTask: Task | null
    ) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const { taskId, sourceBoardId, task } = data;

            // 같은 보드 내에서의 이동
            if (sourceBoardId === boardId) {
                const oldIndex = tasks.findIndex((t) => t.id === taskId);
                const newIndex = targetTask
                    ? tasks.findIndex((t) => t.id === targetTask.id)
                    : tasks.length;

                if (oldIndex !== newIndex) {
                    const newTasks = [...tasks];
                    newTasks.splice(oldIndex, 1);
                    newTasks.splice(newIndex, 0, task);
                    boardActions.reorderTaskInBoard(boardId, newTasks);
                }
            }
            // 다른 보드로의 이동
            else {
                const targetIndex = targetTask
                    ? tasks.findIndex((t) => t.id === targetTask.id)
                    : tasks.length;
                const newTasks = [...tasks];
                newTasks.splice(targetIndex, 0, task);
                boardActions.moveTaskBetweenBoards(
                    taskId,
                    sourceBoardId,
                    boardId,
                    newTasks
                );
            }
        } catch (error) {
            console.error("태스크 드롭 처리 중 오류 발생:", error);
        }
    };

    return (
        <div
            className={`space-y-2 min-h-[100px] p-2 select-none relative`}
            onDragOver={(e) => handleTaskDragOver(e)}
            onDragLeave={handleTaskDragLeave}
            onDrop={(e) => {
                handleTaskDrop(e, null);
                setDropPosition(null);
            }}
        >
            {tasks.map((task) => (
                <div
                    key={task.id}
                    data-task-id={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task)}
                    onDragEnd={(e) => {
                        handleTaskDragEnd(e);
                        setDropPosition(null);
                    }}
                    onDragOver={(e) => handleTaskDragOver(e, task)}
                    onDragLeave={handleTaskDragLeave}
                    onDrop={(e) => {
                        handleTaskDrop(e, task);
                        setDropPosition(null);
                    }}
                    ref={draggedTask?.id === task.id ? draggedTaskRef : null}
                    className={`
                        relative rounded-lg shadow-sm bg-white
                        transition-all ease-in-out
                        ${draggedTask?.id === task.id ? "opacity-30" : ""}
                        ${
                            dropPosition?.taskId === task.id
                                ? "border-2 border-dashed border-blue-500"
                                : ""
                        }
                        ${
                            dropPosition?.taskId === task.id &&
                            dropPosition.position === "before"
                                ? "mb-8"
                                : "mb-2"
                        }
                        ${
                            dropPosition?.taskId === task.id &&
                            dropPosition.position === "after"
                                ? "mt-8"
                                : "mt-2"
                        }
                        hover:cursor-grab active:cursor-grabbing
                    `}
                >
                    {dropPosition?.taskId === task.id && (
                        <div
                            className={`
                                absolute left-0 right-0
                                ${
                                    dropPosition.position === "before"
                                        ? "-top-4"
                                        : "-bottom-4"
                                }

                                rounded-md

                            `}
                        />
                    )}
                    <div className="relative z-10 bg-white rounded-lg">
                        <TaskItem
                            task={task}
                            boardId={boardId}
                            boardActions={boardActions}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
