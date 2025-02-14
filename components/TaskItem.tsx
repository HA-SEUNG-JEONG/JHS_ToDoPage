import { useState } from "react";
import { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    task: Task;
    boardId: string;
    onEdit: (boardId: string, taskId: string, title: string) => void;
    onDelete: (boardId: string, taskId: string) => void;
};

export default function TaskItem({ task, boardId, onEdit, onDelete }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: task.id
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: transform ? 999 : "auto"
    };

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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // 드래그 이벤트와 충돌 방지
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
        <li
            ref={setNodeRef}
            style={style}
            className="group px-3 py-2 bg-white rounded-lg border border-gray-200 flex justify-between items-center hover:shadow-sm transition-shadow"
        >
            {/* 드래그 핸들러를 텍스트 또는 특정 영역에만 적용 */}
            <div {...attributes} {...listeners} className="cursor-grab flex-1">
                <span className="text-sm text-gray-700">{task.title}</span>
            </div>

            {/* 수정/삭제 버튼 */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
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
