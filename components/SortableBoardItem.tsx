// components/Board/SortableBoardItem.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Board, BoardAction } from "@/types";
import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

type Props = {
    board: Board;
    boardActions: BoardAction;
};

export default function SortableBoardItem({ board, boardActions }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(board.title);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: board.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        boardActions.onEdit(board.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(board.title);
        setIsEditing(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("정말로 이 보드를 삭제하시겠습니까?")) {
            boardActions.onDelete(board.id);
        }
    };

    if (isEditing) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="p-4 bg-white rounded-lg shadow"
            >
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        maxLength={50}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-1 cursor-move"
                >
                    <h3 className="text-lg font-semibold text-black">
                        {board.title}
                    </h3>
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="text-gray-500 hover:text-blue-500"
                    >
                        <span className="text-sm">수정</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <span className="text-sm">삭제</span>
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <TaskForm
                    onSubmit={(title) =>
                        boardActions.onTaskAdd(board.id, title)
                    }
                />
                <TaskList tasks={board.tasks} />
            </div>
        </div>
    );
}
