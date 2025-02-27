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
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const draggedTaskRef = useRef<HTMLDivElement | null>(null);

    const handleTouchStart = (
        e: React.TouchEvent<HTMLDivElement>,
        task: Task
    ) => {
        e.preventDefault();
        setDraggedTask(task);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedTask) return;

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
        );

        const targetTask = elements.find((el) => {
            const taskId = el.getAttribute("data-task-id");
            return taskId && taskId !== draggedTask.id;
        });

        if (targetTask) {
            setDropTargetId(targetTask.getAttribute("data-task-id") || null);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedTask) return;

        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "1";
            draggedTaskRef.current.style.transform = "none";
            draggedTaskRef.current.style.backgroundColor = "transparent";
        }

        if (dropTargetId) {
            const oldIndex = tasks.findIndex((t) => t.id === draggedTask.id);
            const newIndex = tasks.findIndex((t) => t.id === dropTargetId);

            if (oldIndex !== newIndex) {
                const newTasks = [...tasks];
                newTasks.splice(oldIndex, 1);
                newTasks.splice(newIndex, 0, draggedTask);
                boardActions.reorderTaskInBoard(boardId, newTasks);
            }
        }
    };

    const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "1";
        }
        setDraggedTask(null);
        setDropTargetId(null);
    };

    const handleTaskDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task
    ) => {
        e.stopPropagation();
        setDraggedTask(task);

        e.dataTransfer.effectAllowed = "move";
        // 현재 보드 ID와 태스크 정보를 저장
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
        setDraggedTask(null);
        setDropTargetId(null);
        if (e.dataTransfer.dropEffect === "none") {
            console.log("태스크 드래그 앤 드롭 실패");
        }
    };

    const handleTaskDragOver = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task | null
    ) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedTask?.id !== task?.id) {
            setDropTargetId(task?.id || null);
        }
        e.dataTransfer.dropEffect = "move";
    };

    const handleTaskDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetTask: Task | null
    ) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const { taskId, sourceBoardId, task } = data;

            // 같은 보드 내에서의 이동
            if (sourceBoardId === boardId) {
                const oldIndex = tasks.findIndex((t) => t.id === taskId);
                const newIndex = tasks.findIndex(
                    (t) => t.id === targetTask?.id
                );

                if (oldIndex !== newIndex) {
                    const newTasks = [...tasks];
                    newTasks.splice(oldIndex, 1);
                    newTasks.splice(newIndex, 0, task);
                    boardActions.reorderTaskInBoard(boardId, newTasks);
                }
            }
            // 다른 보드로의 이동
            else {
                const targetIndex = tasks.findIndex(
                    (t) => t.id === targetTask?.id
                );
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

    const handleEmptySpaceDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const { taskId, sourceBoardId, task } = data;

            // 같은 보드의 빈 공간으로 이동
            if (sourceBoardId === boardId) {
                const oldIndex = tasks.findIndex((t) => t.id === taskId);
                if (oldIndex !== tasks.length - 1) {
                    const newTasks = [...tasks];
                    newTasks.splice(oldIndex, 1);
                    newTasks.push(task);
                    boardActions.reorderTaskInBoard(boardId, newTasks);
                }
            }
            // 다른 보드의 빈 공간으로 이동
            else {
                const newTasks = [...tasks, task];
                boardActions.moveTaskBetweenBoards(
                    taskId,
                    sourceBoardId,
                    boardId,
                    newTasks
                );
            }
        } catch (error) {
            console.error("빈 공간 드롭 처리 중 오류 발생:", error);
        }
    };

    const handleTaskDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);
    };

    return (
        <div
            className="space-y-2 min-h-[100px] p-2 select-none"
            onDragOver={(e) => handleTaskDragOver(e, null)}
            onDrop={handleEmptySpaceDrop}
        >
            {tasks.map((task) => (
                <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task)}
                    onDragEnd={handleTaskDragEnd}
                    onDragOver={(e) => handleTaskDragOver(e, task)}
                    onDragLeave={handleTaskDragLeave}
                    onDrop={(e) => handleTaskDrop(e, task)}
                    onTouchStart={(e) => handleTouchStart(e, task)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    ref={draggedTask?.id === task.id ? draggedTaskRef : null}
                    className="rounded-lg shadow-sm cursor-grab transition-all dragging:opacity-50"
                >
                    {dropTargetId === task.id &&
                        draggedTask?.id !== task.id && (
                            <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg z-10 pointer-events-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white px-2 py-0.5 text-sm rounded-full text-blue-500 font-medium shadow-sm">
                                        여기에 드롭하세요
                                    </span>
                                </div>
                            </div>
                        )}
                    <TaskItem
                        task={task}
                        boardId={boardId}
                        boardActions={boardActions}
                    />
                </div>
            ))}
        </div>
    );
}
