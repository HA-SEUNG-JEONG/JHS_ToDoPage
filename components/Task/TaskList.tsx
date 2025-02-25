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
    const draggedTaskRef = useRef<HTMLDivElement | null>(null);

    const handleTaskDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task
    ) => {
        setDraggedTask(task);
        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "0.5";
        }
        e.dataTransfer.effectAllowed = "move";
        // 현재 보드 ID와 태스크 정보를 저장
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
                taskId: task.id,
                sourceBoardId: boardId,
                task: task
            })
        );
    };

    const handleTaskDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (draggedTaskRef.current) {
            draggedTaskRef.current.style.opacity = "1";
        }
        setDraggedTask(null);
        if (e.dataTransfer.dropEffect === "none") {
            console.log("태스크 드래그 앤 드롭 실패");
        }
    };

    const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleTaskDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetTask: Task
    ) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const { taskId, sourceBoardId, task } = data;

            // 같은 보드 내에서의 이동
            if (sourceBoardId === boardId) {
                const oldIndex = tasks.findIndex((t) => t.id === taskId);
                const newIndex = tasks.findIndex((t) => t.id === targetTask.id);

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
                    (t) => t.id === targetTask.id
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

    return (
        <div
            className="space-y-2 min-h-[100px] p-2"
            onDragOver={handleTaskDragOver}
            onDrop={handleEmptySpaceDrop}
        >
            {tasks.map((task) => (
                <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task)}
                    onDragEnd={handleTaskDragEnd}
                    onDragOver={handleTaskDragOver}
                    onDrop={(e) => handleTaskDrop(e, task)}
                    ref={draggedTask?.id === task.id ? draggedTaskRef : null}
                    className="bg-white rounded-lg shadow-sm p-3 cursor-move hover:shadow-md transition-shadow"
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
