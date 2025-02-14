"use client";

import { useState, useEffect } from "react";
import { Board, Task } from "@/types";
import { storageUtil } from "@/utils/storage";
import BoardList from "./BoardList";
import CreateBoardForm from "./CreateBoardForm";

export default function BoardContainer() {
    const [boards, setBoards] = useState<Board[]>([]);

    const saveBoardInStorage = (board: Board[]) => {
        setBoards(board);
        storageUtil.saveBoards(board);
    };

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
        saveBoardInStorage(updatedBoards);
    };

    const editBoard = (id: string, newTitle: string) => {
        const updatedBoards = boards.map((board) =>
            board.id === id ? { ...board, title: newTitle } : board
        );
        saveBoardInStorage(updatedBoards);
    };

    const deleteBoard = (id: string) => {
        const updatedBoards = boards.filter((board) => board.id !== id);
        saveBoardInStorage(updatedBoards);
    };

    const reorderBoards = (reorderedBoards: Board[]) => {
        setBoards(reorderedBoards);
        storageUtil.saveBoards(reorderedBoards);
    };

    const addTask = (boardId: string, title: string) => {
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
                            boardId
                        }
                    ]
                };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const editTask = (boardId: string, taskId: string, newTitle: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                const updatedTasks = board.tasks.map((task) =>
                    task.id === taskId ? { ...task, title: newTitle } : task
                );
                return { ...board, tasks: updatedTasks };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const deleteTask = (boardId: string, taskId: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                return {
                    ...board,
                    tasks: board.tasks.filter((task) => task.id !== taskId)
                };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const reoderTask = (boardId: string, tasks: Task[]) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                return {
                    ...board,
                    tasks: [...tasks]
                };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const moveTask = (
        taskId: string,
        sourceBoardId: string,
        targetBoardId: string
    ) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === sourceBoardId) {
                return {
                    ...board,
                    tasks: board.tasks.filter((t) => t.id !== taskId)
                };
            }
            if (board.id === targetBoardId) {
                const taskToMove = boards
                    .find((b) => b.id === sourceBoardId)
                    ?.tasks.find((t) => t.id === taskId);

                if (taskToMove) {
                    return {
                        ...board,
                        tasks: [...(board.tasks || []), { ...taskToMove }]
                    };
                }
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const boardActions = {
        editBoard,
        deleteBoard,
        reorderBoards,
        addTask,
        editTask,
        deleteTask,
        reoderTask,
        moveTask
    };

    return (
        <div className="p-6">
            <CreateBoardForm onSubmit={handleCreateBoard} />
            <BoardList boards={boards} boardActions={boardActions} />
        </div>
    );
}
