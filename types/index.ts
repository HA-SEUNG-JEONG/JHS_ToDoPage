// types/board.ts
export interface Task {
    id: string;
    title: string;
    boardId: string;
}

export interface Board {
    id: string;
    title: string;
    tasks: Task[];
}

export interface BoardAction {
    editBoard: (id: string, title: string) => void;
    deleteBoard: (id: string) => void;
    reorderBoards: (boards: Board[]) => void;
    addTask: (boardId: string, content: string) => void;
    editTask: (boardId: string, taskId: string, content: string) => void;
    deleteTask: (boardId: string, taskId: string) => void;
    reorderTask: (boardId: string, tasks: Task[]) => void;
    moveTask: (
        taskId: string,
        sourceBoardId: string,
        targetBoardId: string
    ) => void;
}
