import { useSortable } from "@dnd-kit/sortable";
import { CSS, Transform } from "@dnd-kit/utilities";
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

    const transformObject: Transform = {
        x: transform?.x ?? 0,
        y: transform?.y ?? 0,
        scaleX: 1,
        scaleY: 1
    };

    const style = {
        transform: CSS.Transform.toString(transformObject),
        transition: isDragging ? "transform 250ms ease" : transition,
        zIndex: isDragging ? 999 : "auto",
        position: "relative" as const
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        boardActions.editBoard(board.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(board.title);
        setIsEditing(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("정말로 이 보드를 삭제하시겠습니까?")) {
            boardActions.deleteBoard(board.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 w-full"
                    >
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            maxLength={50}
                        />
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
                    </form>
                ) : (
                    <>
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab flex-1"
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
                                수정
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-gray-500 hover:text-red-500"
                            >
                                삭제
                            </button>
                        </div>
                    </>
                )}
            </div>

            <TaskForm
                onSubmit={(title) => boardActions.addTask(board.id, title)}
            />
            <TaskList
                tasks={board.tasks}
                boardId={board.id}
                onTaskEdit={boardActions.editTask}
                onTaskDelete={boardActions.deleteTask}
            />
        </div>
    );
}
