import { useState } from "react";
import { Task } from "@/types";

type Props = {
    task: Task;
    boardId: string;
    onEdit: (boardId: string, taskId: string, title: string) => void;
    onDelete: (boardId: string, taskId: string) => void;
};

export default function TaskItem({ task, boardId, onEdit, onDelete }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        onEdit(boardId, task.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("이 할 일을 삭제하시겠습니까?")) {
            onDelete(boardId, task.id);
        }
    };

    if (isEditing) {
        return (
            <li className="px-3 py-2 bg-white rounded-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        maxLength={100}
                    />
                    <div className="flex gap-1">
                        <button
                            type="submit"
                            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="group px-3 py-2 bg-white rounded-lg border border-gray-200 flex justify-between items-center hover:shadow-sm transition-shadow">
            <span className="text-sm text-gray-700">{task.title}</span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-gray-500 hover:text-blue-500 px-2 py-1"
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                    className="text-xs text-gray-500 hover:text-red-500 px-2 py-1"
                >
                    삭제
                </button>
            </div>
        </li>
    );
}
