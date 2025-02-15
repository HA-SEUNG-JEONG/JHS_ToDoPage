import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardAction, Task } from "@/types";

interface TaskItemProps {
    task: Task;
    boardId: string;
    boardActions: BoardAction;
}

export default function TaskItem({
    task,
    boardId,
    boardActions
}: TaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isOver,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            boardId,
            task
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging
            ? "transform 250ms ease box-shadow 200ms ease"
            : transition,
        zIndex: transform ? 999 : "auto",
        position: "relative" as const,
        boxShadow: isDragging
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0,0,0,0.5)"
            : ""
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        boardActions.editTask(boardId, task.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setIsEditing(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("이 할 일을 삭제하시겠습니까?")) {
            boardActions.deleteTask(boardId, task.id);
        }
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="px-3 py-2 bg-white rounded-lg border border-gray-200"
        >
            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        maxLength={100}
                    />
                    <div className="flex gap-1">
                        <button
                            type="submit"
                            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                            aria-label="수정된 할 일 값 저장"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                            aria-label="수정 취소"
                        >
                            취소
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-between items-center group">
                    <div
                        {...attributes}
                        {...listeners}
                        className={`${
                            isOver ? "cursor-grabbing" : "cursor-grab"
                        } flex-1`}
                    >
                        <span className="text-sm text-gray-700 select-none">
                            {task.title}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            aria-label="태스크 수정"
                            className="text-xs text-gray-500 hover:text-blue-500 px-2 py-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-xs text-gray-500 hover:text-red-500 px-2 py-1"
                            aria-label="태스크 삭제"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}
