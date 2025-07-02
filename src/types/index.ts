// types/board.ts
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
    id: string;
    title: string;
    boardId: string;
    status: TaskStatus;
}

export interface Board {
    id: string;
    title: string;
    tasks: Task[];
}
