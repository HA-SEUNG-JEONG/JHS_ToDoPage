import { useState } from "react";
import { Board, BoardAction } from "@/types";

type BoardProps = {
    board: Board;
    onEdit: BoardAction["editBoard"];
    onDelete: BoardAction["deleteBoard"];
};

export default function BoardItem({ board, onEdit, onDelete }: BoardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(board.title);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        onEdit(board.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(board.title);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("정말로 이 보드를 삭제하시겠습니까?")) {
            onDelete(board.id);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            {isEditing ? (
                <div className="p-4 bg-white rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
            ) : (
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-black">
                        {board.title}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
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
            )}
        </div>
    );
}
