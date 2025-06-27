import { useState, useEffect, useCallback } from "react";
import { Board, Task, TaskStatus } from "@/types";
import { storageUtil } from "@/utils/storage";
import BoardList from "./BoardList";
import CreateBoardForm from "./CreateBoardForm";
import { BoardActions } from "@/types/action";

const DEFAULT_BOARDS: Omit<Board, "id">[] = [
    { title: "To do", tasks: [] },
    { title: "In Progress", tasks: [] },
    { title: "Done", tasks: [] }
];

const getTaskStatus = (boardTitle: string): TaskStatus => {
    switch (boardTitle) {
        case "In Progress":
            return "in-progress";
        case "Done":
            return "done";
        case "To do":
        default:
            return "todo";
    }
};

export default function BoardContainer() {
    const [boards, setBoards] = useState<Board[]>([]);

    const saveBoardInStorage = (updatedBoards: Board[]) => {
        setBoards(updatedBoards);
        storageUtil.saveBoards(updatedBoards);
    };

    useEffect(() => {
        const savedBoards = storageUtil.getBoards();
        if (savedBoards.length === 0) {
            const defaultBoards = DEFAULT_BOARDS.map((board) => ({
                ...board,
                id: crypto.randomUUID()
            }));
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
        saveBoardInStorage([...boards, newBoard]);
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
        saveBoardInStorage(reorderedBoards);
    };

    const addTask = (boardId: string, title: string) => {
        const board = boards.find((b) => b.id === boardId);
        if (!board) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            boardId,
            status: getTaskStatus(board.title)
        };

        const updatedBoards = boards.map((board) => {
            if (board.id !== boardId) return board;
            return {
                ...board,
                tasks: [...board.tasks, newTask]
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

    const deleteTask = useCallback(
        (boardId: string, taskId: string) => {
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
        },
        [boards, saveBoardInStorage]
    );

    const reorderTaskInBoard = (boardId: string, tasks: Task[]) => {
        const updatedBoards = boards.map((board) =>
            board.id === boardId ? { ...board, tasks } : board
        );
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

        const newStatus = getTaskStatus(targetBoard.title);
        const updatedTaskToMove = {
            ...taskToMove,
            boardId: targetBoardId,
            status: newStatus
        };

        const updatedBoards = boards.map((board) => {
            if (board.id === sourceBoardId) {
                return {
                    ...board,
                    tasks: board.tasks.filter((task) => task.id !== taskId)
                };
            }
            if (board.id === targetBoardId) {
                return {
                    ...board,
                    tasks: [...board.tasks, updatedTaskToMove]
                };
            }
            return board;
        });

        saveBoardInStorage(updatedBoards);
    };

    const boardActions: BoardActions = {
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
