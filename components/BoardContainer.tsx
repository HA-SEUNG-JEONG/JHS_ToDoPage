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
            title,
            tasks: []
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
        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    const handleReorderBoards = (reorderedBoards: Board[]) => {
        setBoards(reorderedBoards);
        storageUtil.saveBoards(reorderedBoards);
    };

    const handleTaskAdd = (boardId: string, title: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                const currentTasks = Array.isArray(board.tasks)
                    ? board.tasks
                    : [];
                return {
                    ...board,
                    tasks: [
                        ...currentTasks,
                        {
                            id: crypto.randomUUID(),
                            title,
                            createdAt: new Date().toISOString()
                        }
                    ]
                };
            }
            return board;
        });

        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    const handleTaskEdit = (
        boardId: string,
        taskId: string,
        newTitle: string
    ) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                const updatedTasks = board.tasks.map((task) =>
                    task.id === taskId ? { ...task, title: newTitle } : task
                );
                return { ...board, tasks: updatedTasks };
            }
            return board;
        });

        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    const handleTaskDelete = (boardId: string, taskId: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                return {
                    ...board,
                    tasks: board.tasks.filter((task) => task.id !== taskId)
                };
            }
            return board;
        });

        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    return (
        <div className="p-6">
            <CreateBoardForm onSubmit={handleCreateBoard} />
            <BoardList
                boards={boards}
                boardActions={{
                    onEdit: handleEditBoard,
                    onDelete: handleDeleteBoard,
                    onReorder: handleReorderBoards,
                    onTaskAdd: handleTaskAdd,
                    onTaskEdit: handleTaskEdit,
                    onTaskDelete: handleTaskDelete
                }}
            />
        </div>
    );
}
