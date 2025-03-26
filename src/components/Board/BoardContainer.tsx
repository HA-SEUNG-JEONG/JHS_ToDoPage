import { useState, useEffect } from "react";

import BoardList from "./BoardList";
import CreateBoardForm from "./CreateBoardForm";
import { Board, Task, TaskStatus } from "@/src/types";
import { storageUtil } from "@/src/utils/storage";

export default function BoardContainer() {
    const [boards, setBoards] = useState<Board[]>([]);

    const saveBoardInStorage = (board: Board[]) => {
        setBoards(board);
        storageUtil.saveBoards(board);
    };

    useEffect(() => {
        const savedBoards = storageUtil.getBoards();
        if (savedBoards.length === 0) {
            // 기본 상태 보드 생성
            const defaultBoards: Board[] = [
                {
                    id: crypto.randomUUID(),
                    title: "To do",
                    tasks: []
                },
                {
                    id: crypto.randomUUID(),
                    title: "In Progress",
                    tasks: []
                },
                {
                    id: crypto.randomUUID(),
                    title: "Done",
                    tasks: []
                }
            ];
            saveBoardInStorage(defaultBoards);
        } else {
            setBoards(savedBoards);
        }
    }, []);

    const createBoard = (title: string) => {
        const newBoard: Board = {
            id: crypto.randomUUID(),
            title,
            tasks: []
        };

        const updatedBoards = [...boards, newBoard];
        saveBoardInStorage(updatedBoards);
    };

    const editBoardTitle = (id: string, newTitle: string) => {
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
        const board = boards.find((b) => b.id === boardId);
        if (!board) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            boardId,
            status:
                board.title === "To do"
                    ? "todo"
                    : board.title === "In Progress"
                    ? "in-progress"
                    : "done"
        };

        const updatedBoards = boards.map((board) => {
            if (board.id !== boardId) return board;

            const tasks = Array.isArray(board.tasks) ? board.tasks : [];
            return {
                ...board,
                tasks: [...tasks, newTask]
            };
        });

        saveBoardInStorage(updatedBoards);
    };

    const editTask = (boardId: string, taskId: string, newTitle: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id !== boardId) return board;

            const updatedTasks = board.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle } : task
            );

            return { ...board, tasks: updatedTasks };
        });

        saveBoardInStorage(updatedBoards);
    };

    const deleteTask = (boardId: string, taskId: string) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                const filteredTasks = board.tasks.filter(
                    (task) => task.id !== taskId
                );
                return { ...board, tasks: filteredTasks };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const reorderTaskInBoard = (boardId: string, tasks: Task[]) => {
        const updatedBoards = boards.map((board) => {
            if (board.id === boardId) {
                return { ...board, tasks };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const moveTaskBetweenBoards = (
        taskId: string,
        sourceBoardId: string,
        targetBoardId: string
    ) => {
        const sourceBoard = boards.find((board) => board.id === sourceBoardId);
        const targetBoard = boards.find((board) => board.id === targetBoardId);
        if (!sourceBoard || !targetBoard) return;

        const taskToMove = sourceBoard.tasks.find((task) => task.id === taskId);
        if (!taskToMove) return;

        // 이동된 태스크의 상태 업데이트
        const newStatus: TaskStatus =
            targetBoard.title === "To do"
                ? "todo"
                : targetBoard.title === "In Progress"
                ? "in-progress"
                : "done";

        const updatedTaskToMove = {
            ...taskToMove,
            boardId: targetBoardId,
            status: newStatus
        };

        const updateBoard = {
            [sourceBoardId]: {
                tasks: sourceBoard.tasks.filter((task) => task.id !== taskId)
            },
            [targetBoardId]: {
                tasks: [...targetBoard.tasks, updatedTaskToMove]
            }
        };

        const updatedBoards = boards.map((board) =>
            updateBoard[board.id]
                ? { ...board, ...updateBoard[board.id] }
                : board
        );

        saveBoardInStorage(updatedBoards);
    };

    const boardActions = {
        editBoardTitle,
        deleteBoard,
        reorderBoards,
        addTask,
        editTask,
        deleteTask,
        reorderTaskInBoard,
        moveTaskBetweenBoards
    };

    return (
        <div className="p-6 select-none">
            <CreateBoardForm onSubmit={createBoard} />
            <BoardList boards={boards} boardActions={boardActions} />
        </div>
    );
}
