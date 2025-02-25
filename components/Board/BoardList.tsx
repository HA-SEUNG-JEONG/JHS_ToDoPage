import { Board, BoardAction } from "@/types";
import { useState, useRef } from "react";
import SortableBoardItem from "./SortableBoardItem";

type Props = {
    boards: Board[];
    boardActions: BoardAction;
};

export default function BoardList({ boards, boardActions }: Props) {
    const [draggedBoard, setDraggedBoard] = useState<Board | null>(null);
    const draggedBoardRef = useRef<HTMLDivElement | null>(null);

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        board: Board
    ) => {
        setDraggedBoard(board);
        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "0.5";
        }
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
        }
        setDraggedBoard(null);
        if (e.dataTransfer.dropEffect === "none") {
            console.log("드래그 앤 드랍 실패");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetBoard: Board
    ) => {
        e.preventDefault();
        if (!draggedBoard) return;

        const oldIndex = boards.findIndex(
            (board) => board.id === draggedBoard.id
        );
        const newIndex = boards.findIndex(
            (board) => board.id === targetBoard.id
        );

        if (oldIndex !== newIndex) {
            const newBoards = [...boards];
            newBoards.splice(oldIndex, 1);
            newBoards.splice(newIndex, 0, draggedBoard);

            boardActions.reorderBoards(newBoards);
        }
    };

    if (boards.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                생성된 보드가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
                <div
                    key={board.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, board)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, board)}
                    ref={draggedBoard?.id === board.id ? draggedBoardRef : null}
                >
                    <SortableBoardItem
                        board={board}
                        boardActions={boardActions}
                    />
                </div>
            ))}
        </div>
    );
}
