"use client";

import { useState, useEffect } from "react";
import { Board } from "@/types";
import { storageUtil } from "@/utils/storage";
import BoardList from "./BoardList";
import CreateBoardForm from "./CreateBoardForm";

export default function BoardContainer() {
    const [boards, setBoards] = useState<Board[]>([]);

    useEffect(() => {
        const savedBoards = storageUtil.getBoards();
        setBoards(savedBoards);
    }, []);

    const handleCreateBoard = (title: string) => {
        const newBoard: Board = {
            id: crypto.randomUUID(),
            title
        };

        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    const handleEditBoard = (id: string, newTitle: string) => {
        const updatedBoards = boards.map((board) =>
            board.id === id ? { ...board, title: newTitle } : board
        );
        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    const handleDeleteBoard = (id: string) => {
        const updatedBoards = boards.filter((board) => board.id !== id);
        setBoards(boards.filter((board) => board.id !== id));
        storageUtil.saveBoards(updatedBoards);
    };

    const handleReorderBoard = (reorderBoards: Board[]) => {
        setBoards(reorderBoards);
        storageUtil.saveBoards(reorderBoards);
    };

    return (
        <div className="p-6">
            <CreateBoardForm onSubmit={handleCreateBoard} />
            <BoardList
                boards={boards}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
                onReorder={handleReorderBoard}
            />
        </div>
    );
}
