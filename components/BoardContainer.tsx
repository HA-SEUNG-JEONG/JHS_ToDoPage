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

    return (
        <div className="p-6">
            <CreateBoardForm onSubmit={handleCreateBoard} />
            <BoardList boards={boards} />
        </div>
    );
}
