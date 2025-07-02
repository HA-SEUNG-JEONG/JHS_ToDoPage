import { Board } from "@/types";
import { useState, useRef } from "react";
import SortableBoardItem from "./SortableBoardItem";
import { useBoards } from "@/context/BoardContext";

type Props = {
    boards: Board[];
};

export default function BoardList({ boards }: Props) {
    const { dispatch } = useBoards();
    const [draggedBoard, setDraggedBoard] = useState<Board | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const draggedBoardRef = useRef<HTMLDivElement | null>(null);
    const touchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        board: Board
    ) => {
        e.stopPropagation();
        setDraggedBoard(board);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        e.dataTransfer.dropEffect = "move";
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetBoard: Board
    ) => {
        e.stopPropagation();

        if (!draggedBoard) return;

        const oldIndex = boards.findIndex(
            (board) => board.id === draggedBoard.id
        );
        const newIndex = boards.findIndex(
            (board) => board.id === targetBoard.id
        );

        if (oldIndex === newIndex) return;

        if (oldIndex !== newIndex) {
            const newBoards = [...boards];
            newBoards.splice(oldIndex, 1);
            newBoards.splice(newIndex, 0, draggedBoard);

            dispatch({ type: "REORDER_BOARDS", payload: newBoards });
        }
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
        }
        setDraggedBoard(null);

        if (e.dataTransfer.dropEffect === "none") {
            console.log("드래그 앤 드랍 실패");
        }
    };

    // 터치 이벤트 핸들러
    const handleTouchStart = (e: React.TouchEvent, board: Board) => {
        e.stopPropagation();
        setDraggedBoard(board);
        setIsDragging(true);

        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "0.5";
        }

        // 햅틱 피드백
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !draggedBoard) return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const boardElement = element?.closest(
            "[data-board-id]"
        ) as HTMLElement | null;

        if (boardElement && draggedBoardRef.current) {
            const targetBoardId = boardElement.getAttribute("data-board-id");
            if (targetBoardId && draggedBoard.id !== targetBoardId) {
                const targetBoard = boards.find((b) => b.id === targetBoardId);
                if (targetBoard) {
                    const oldIndex = boards.findIndex(
                        (b) => b.id === draggedBoard.id
                    );
                    const newIndex = boards.findIndex(
                        (b) => b.id === targetBoard.id
                    );

                    if (oldIndex !== newIndex) {
                        // Visually reorder elements without dispatching state change yet
                        const newBoards = [...boards];
                        newBoards.splice(oldIndex, 1);
                        newBoards.splice(newIndex, 0, draggedBoard);

                        // This part is tricky without direct DOM manipulation or a library.
                        // For now, we'll rely on the touchend to dispatch the actual reorder.
                        // A more advanced solution would involve creating a ghost element
                        // and dynamically positioning it, or using CSS transforms.
                    }
                }
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
        }

        if (!draggedBoard) return;

        setIsDragging(false);

        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const boardElement = element?.closest(
            "[data-board-id]"
        ) as HTMLElement | null;

        if (boardElement) {
            const targetBoardId = boardElement.getAttribute("data-board-id");
            if (targetBoardId && draggedBoard.id !== targetBoardId) {
                const targetBoard = boards.find((b) => b.id === targetBoardId);
                if (targetBoard) {
                    const oldIndex = boards.findIndex(
                        (b) => b.id === draggedBoard.id
                    );
                    const newIndex = boards.findIndex(
                        (b) => b.id === targetBoard.id
                    );

                    if (oldIndex !== newIndex) {
                        const newBoards = [...boards];
                        newBoards.splice(oldIndex, 1);
                        newBoards.splice(newIndex, 0, draggedBoard);
                        dispatch({
                            type: "REORDER_BOARDS",
                            payload: newBoards
                        });
                    }
                }
            }
        }
        setDraggedBoard(null);
    };

    if (boards.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                생성된 보드가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none touch-none">
            {boards.map((board) => (
                <div
                    key={board.id}
                    data-board-id={board.id}
                    draggable={!isDragging} // Only draggable on desktop
                    onTouchStart={(e) => handleTouchStart(e, board)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
                    onDragStart={(e) => handleDragStart(e, board)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, board)}
                    ref={draggedBoard?.id === board.id ? draggedBoardRef : null}
                    className={`
                        select-none
                        ${isDragging ? "opacity-50" : ""}
                    `}
                >
                    <SortableBoardItem board={board} />
                </div>
            ))}
        </div>
    );
}
