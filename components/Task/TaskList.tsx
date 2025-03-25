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

    const touchTimeout = useRef<NodeJS.Timeout | null>(null);

    // 터치 이벤트 핸들러
    const handleTouchStart = (e: React.TouchEvent, task: Task) => {
        e.stopPropagation();

        // 롱 프레스 감지를 위한 타임아웃 설정
        touchTimeout.current = setTimeout(() => {
            setDraggedTask(task);
            setIsDragging(true);
        }, 500); // 500ms 롱 프레스
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !draggedTask) return;

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
                boardActions.moveTaskBetweenBoards(
                    draggedTask.id,
                    boardId,
                    targetBoardId
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
    };

    const handleTaskDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task
    ) => {
        e.stopPropagation();
        setDraggedTask(task);
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
        setDraggedTask(null);
        setDropPosition(null);
    };

    const handleTaskDragOver = (
        e: React.DragEvent<HTMLDivElement>,
        task?: Task
    ) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";

        if (!task) {
            setDropPosition({ taskId: undefined, position: "after" });
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const position = y < rect.height / 2 ? "before" : "after";
        if (draggedTask?.id !== task?.id) {
            setDropPosition({ taskId: task?.id, position });
        }
    };

    const handleTaskDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetTask?: Task
    ) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const { taskId, sourceBoardId } = data;

            if (sourceBoardId === boardId) {
                // 같은 보드 내에서의 이동
                const oldIndex = tasks.findIndex((t) => t.id === taskId);
                const newIndex = targetTask
                    ? tasks.findIndex((t) => t.id === targetTask.id)
                    : tasks.length;

                if (oldIndex !== newIndex) {
                    const newTasks = [...tasks];
                    newTasks.splice(oldIndex, 1);
                    newTasks.splice(newIndex, 0, tasks[oldIndex]);
                    boardActions.reorderTaskInBoard(boardId, newTasks);
                }
            } else {
                // 다른 보드로의 이동
                boardActions.moveTaskBetweenBoards(
                    taskId,
                    sourceBoardId,
                    boardId
                );
            }
        } catch (error) {
            console.error("태스크 드롭 처리 중 오류 발생:", error);
        }

        setDropPosition(null);
    };

    return (
        <div
            className={`mt-4 space-y-2 min-h-[100px] ${
                tasks.length === 0
                    ? "border-2 border-dashed border-gray-200 rounded-lg p-4"
                    : ""
            }`}
            data-board-id={boardId}
            onDragOver={(e) => handleTaskDragOver(e, undefined)}
            onDrop={(e) => handleTaskDrop(e, undefined)}
        >
            {tasks.map((task) => (
                <div
                    key={task.id}
                    data-task-id={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task)}
                    onDragEnd={handleTaskDragEnd}
                    onDragOver={(e) => handleTaskDragOver(e, task)}
                    onDrop={(e) => handleTaskDrop(e, task)}
                    onTouchStart={(e) => handleTouchStart(e, task)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`${
                        draggedTask?.id === task.id
                            ? "opacity-50"
                            : "opacity-100"
                    } transition-opacity duration-200 ${
                        dropPosition?.taskId === task.id
                            ? dropPosition.position === "before"
                                ? "border-t-2 border-blue-500"
                                : "border-b-2 border-blue-500"
                            : ""
                    }`}
                >
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
