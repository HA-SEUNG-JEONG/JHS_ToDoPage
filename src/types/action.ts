import { Board, Task } from "./index";

export type BoardActions = {
    editBoardTitle: (id: string, newTitle: string) => void;
    deleteBoard: (id: string) => void;
    reorderBoards: (reorderedBoards: Board[]) => void;
    addTask: (boardId: string, title: string) => void;
    editTask: (boardId: string, taskId: string, newTitle: string) => void;
    deleteTask: (boardId: string, taskId: string) => void;
    reorderTaskInBoard: (boardId: string, tasks: Task[]) => void;
    moveTaskBetweenBoards: (
        taskId: string,
        sourceBoardId: string,
        targetBoardId: string
    ) => void;
};
