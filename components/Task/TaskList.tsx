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
    const [isDragging, setIsDragging] = useState(false);
    const [dropPosition, setDropPosition] = useState<{
        taskId: string | undefined;
        position: "before" | "after";
    } | null>(null);

    const draggedTaskRef = useRef<HTMLDivElement | null>(null);
    const touchTimeout = useRef<NodeJS.Timeout | null>(null);

    // 터치 이벤트 핸들러
    const handleTouchStart = (e: React.TouchEvent, task: Task) => {
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation();

        // 롱 프레스 감지를 위한 타임아웃 설정
        touchTimeout.current = setTimeout(() => {
            setDraggedTask(task);
            setIsDragging(true);
            if (draggedTaskRef.current) {
                draggedTaskRef.current.style.opacity = "0.5";
            }
        }, 500); // 500ms 롱 프레스
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !draggedTask) return;

        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        // 보드 요소 찾기
        const boardElement = element?.closest(
            "[data-board-id]"
        ) as HTMLElement | null;
        const taskElement = element?.closest(
            "[data-task-id]"
        ) as HTMLElement | null;

        if (boardElement) {
            const targetBoardId = boardElement.getAttribute("data-board-id");

            // 다른 보드로 이동하는 경우
            if (targetBoardId && targetBoardId !== boardId) {
                if (taskElement) {
                    const taskId =
                        taskElement.getAttribute("data-task-id") || undefined;
                    const rect = taskElement.getBoundingClientRect();
                    const position =
                        touch.clientY < rect.top + rect.height / 2
                            ? "before"
                            : "after";

                    setDropPosition({ taskId, position });
                } else {
                    // 보드의 마지막으로 이동
                    setDropPosition({ taskId: undefined, position: "after" });
                }
            }
            // 같은 보드 내에서 이동하는 경우
            else if (taskElement) {
                const taskId =
                    taskElement.getAttribute("data-task-id") || undefined;
                const rect = taskElement.getBoundingClientRect();
                const position =
                    touch.clientY < rect.top + rect.height / 2
                        ? "before"
                        : "after";

                if (draggedTask.id !== taskId) {
                    setDropPosition({ taskId, position });
                }
            }
        }
    };

    const handleTouchEnd = () => {
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
        }

        if (isDragging && draggedTask && dropPosition) {
            const element = document.elementFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2
            );
            const boardElement = element?.closest(
                "[data-board-id]"
            ) as HTMLElement | null;
            const targetBoardId = boardElement?.getAttribute("data-board-id");

            // 다른 보드로 이동하는 경우
            if (targetBoardId && targetBoardId !== boardId) {
                const targetTask = tasks.find(
                    (t) => t.id === dropPosition.taskId
                );
                const targetIndex = targetTask
                    ? tasks.findIndex((t) => t.id === targetTask.id)
                    : tasks.length;

                const newTasks = [...tasks];
                newTasks.splice(targetIndex, 0, draggedTask);
                boardActions.moveTaskBetweenBoards(
                    draggedTask.id,
                    boardId,
                    targetBoardId,
                    newTasks
                );
            }
            // 같은 보드 내에서 이동하는 경우
            else {
                const targetTask = tasks.find(
                    (t) => t.id === dropPosition.taskId
                );
                const oldIndex = tasks.findIndex(
                    (t) => t.id === draggedTask.id
                );
                const newIndex = targetTask
                    ? tasks.findIndex((t) => t.id === targetTask.id)
                    : tasks.length;

                if (oldIndex !== newIndex) {
                    const newTasks = [...tasks];
                    newTasks.splice(oldIndex, 1);
                    newTasks.splice(newIndex, 0, draggedTask);
                    boardActions.reorderTaskInBoard(boardId, newTasks);
                }
            }
        }

        setIsDragging(false);
        setDraggedTask(null);
        setDropPosition(null);

        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "1";
        }
    };

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
            className={`space-y-2 min-h-[100px] p-2 select-none relative touch-none`}
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
                    onTouchStart={(e) => handleTouchStart(e, task)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={(e) => e.preventDefault()} // 컨텍스트 메뉴 방지
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
                        touch-none select-none
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
                        ${isDragging ? "touch-none" : ""}
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
