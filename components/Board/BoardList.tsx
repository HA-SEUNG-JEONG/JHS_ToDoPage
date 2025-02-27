import { Board, BoardAction } from "@/types";
import { useState, useRef } from "react";
import SortableBoardItem from "./SortableBoardItem";

type Props = {
    boards: Board[];
    boardActions: BoardAction;
};

export default function BoardList({ boards, boardActions }: Props) {
    const [draggedBoard, setDraggedBoard] = useState<Board | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const draggedBoardRef = useRef<HTMLDivElement | null>(null);

    const handleTouchStart = (e: React.TouchEvent, board: Board) => {
        e.preventDefault(); // 스크롤 방지
        setDraggedBoard(board);
        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "0.5";
            draggedBoardRef.current.style.transform = "scale(1.05)";
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!draggedBoard) return;

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
        );

        // 현재 터치 위치 아래에 있는 다른 보드 찾기
        const targetBoard = elements.find((el) => {
            const boardId = el.getAttribute("data-board-id");
            return boardId && boardId !== draggedBoard.id;
        });

        if (targetBoard) {
            setDropTargetId(targetBoard.getAttribute("data-board-id") || null);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!draggedBoard) return;

        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
            draggedBoardRef.current.style.transform = "none";
        }

        if (dropTargetId) {
            const oldIndex = boards.findIndex(
                (board) => board.id === draggedBoard.id
            );
            const newIndex = boards.findIndex(
                (board) => board.id === dropTargetId
            );

            if (oldIndex !== newIndex) {
                const newBoards = [...boards];
                newBoards.splice(oldIndex, 1);
                newBoards.splice(newIndex, 0, draggedBoard);
                boardActions.reorderBoards(newBoards);
            }
        }

        setDraggedBoard(null);
        setDropTargetId(null);
    };

    const handleTouchCancel = (e: React.TouchEvent) => {
        e.preventDefault();
        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
            draggedBoardRef.current.style.transform = "none";
        }
        setDraggedBoard(null);
        setDropTargetId(null);
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        board: Board
    ) => {
        e.stopPropagation();
        setDraggedBoard(board);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
        }
        setDraggedBoard(null);
        setDropTargetId(null);
        if (e.dataTransfer.dropEffect === "none") {
            console.log("드래그 앤 드랍 실패");
        }
    };

    const handleDragOver = (
        e: React.DragEvent<HTMLDivElement>,
        board: Board
    ) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedBoard?.id !== board.id) {
            setDropTargetId(board.id);
        }
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTargetId(null);
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
                    onDragOver={(e) => handleDragOver(e, board)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, board)}
                    onTouchStart={(e) => handleTouchStart(e, board)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    ref={draggedBoard?.id === board.id ? draggedBoardRef : null}
                    className={`relative ${
                        dropTargetId === board.id ? "ring-2 ring-blue-400" : ""
                    }`}
                >
                    {dropTargetId === board.id &&
                        draggedBoard?.id !== board.id && (
                            <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg z-10 pointer-events-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white px-3 py-1 rounded-full text-blue-500 font-medium shadow-sm">
                                        여기에 드롭하세요
                                    </span>
                                </div>
                            </div>
                        )}
                    <SortableBoardItem
                        board={board}
                        boardActions={boardActions}
                    />
                </div>
            ))}
        </div>
    );
}
