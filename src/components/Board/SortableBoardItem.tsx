import { Board } from "@/types";
import { useState, useRef } from "react";
import TaskList from "@/components/Task/TaskList";
import AddTaskForm from "@/components/Task/AddTaskForm";
import BoardHeader from "./BoardHeader";
import { useBoards } from "@/context/BoardContext";

interface SortableBoardItemProps {
    board: Board;
}

export default function SortableBoardItem({ board }: SortableBoardItemProps) {
    const { dispatch } = useBoards();
    const { title, id, tasks } = board;
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const draggedItemRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) return;
        dispatch({ type: "EDIT_BOARD_TITLE", payload: { id: board.id, newTitle: editTitle } });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(board.title);
        setIsEditing(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("정말로 이 보드를 삭제하시겠습니까?")) {
            dispatch({ type: "DELETE_BOARD", payload: { id: board.id } });
        }
    };

    const addTask = (title: string) => {
        dispatch({ type: "ADD_TASK", payload: { boardId: id, title } });
    };

    return (
        <div ref={draggedItemRef} className="p-4 bg-white rounded-lg shadow-md">
            <BoardHeader
                title={title}
                taskCount={tasks.length}
                isEditing={isEditing}
                editTitle={editTitle}
                onEditTitleChange={setEditTitle}
                onEditSubmit={handleSubmit}
                onEditCancel={handleCancel}
                onEditClick={() => setIsEditing(true)}
                onDeleteClick={handleDelete}
            />

            <AddTaskForm onSubmit={addTask} />
            <TaskList tasks={tasks} boardId={id} />
        </div>
    );
}
