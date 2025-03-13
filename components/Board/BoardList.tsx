import { Board, BoardAction } from "@/types";
import { useState, useRef } from "react";
import SortableBoardItem from "./SortableBoardItem";

type Props = {
    boards: Board[];
    boardActions: BoardAction;
};

export default function BoardList({ boards, boardActions }: Props) {
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

            boardActions.reorderBoards(newBoards);
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

        // 롱 프레스 감지를 위한 타임아웃 설정
        touchTimeout.current = setTimeout(() => {
            setDraggedBoard(board);
            setIsDragging(true);
            if (draggedBoardRef.current) {
                draggedBoardRef.current.style.opacity = "0.5";
            }
        }, 500); // 500ms 롱 프레스
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !draggedBoard) return;

        const touch = e.touches[0];
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
                        boardActions.reorderBoards(newBoards);
                    }
                }
            }
        }
    };

    const handleTouchEnd = () => {
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
        }

        setIsDragging(false);
        setDraggedBoard(null);

        if (draggedBoardRef.current) {
            draggedBoardRef.current.style.opacity = "1";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none touch-none">
            {boards.map((board) => (
                <div
                    key={board.id}
                    data-board-id={board.id}
                    draggable
                    onTouchStart={(e) => handleTouchStart(e, board)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    onTouchEnd={handleTouchEnd}
                    onContextMenu={(e) => e.preventDefault()} // 컨텍스트 메뉴 방지
                    onDragStart={(e) => handleDragStart(e, board)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, board)}
                    ref={draggedBoard?.id === board.id ? draggedBoardRef : null}
                    className={`
                        touch-none select-none
                        ${isDragging ? "touch-none" : ""}
                    `}
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
