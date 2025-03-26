import { Task, BoardAction, TaskStatus } from "@/types";
import { useState } from "react";

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
        if (window.confirm("정말로 이 태스크를 삭제하시겠습니까?")) {
            boardActions.deleteTask(boardId, task.id);
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case "todo":
                return "bg-gray-100 text-gray-800";
            case "in-progress":
                return "bg-blue-100 text-blue-800";
            case "done":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: TaskStatus) => {
        switch (status) {
            case "todo":
                return "할 일";
            case "in-progress":
                return "진행 중";
            case "done":
                return "완료";
            default:
                return "할 일";
        }
    };

    return (
        <div className="p-3">
            {isEditing ? (
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        저장
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        취소
                    </button>
                </form>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-sm font-medium ${
                                task.status === "done"
                                    ? "line-through text-gray-500"
                                    : ""
                            }`}
                        >
                            {task.title}
                        </span>
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                task.status
                            )}`}
                        >
                            {getStatusText(task.status)}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="text-gray-500 hover:text-blue-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-red-500"
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
        </div>
    );
}
