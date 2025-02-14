// types/board.ts
export interface Task {
    id: string;
    title: string;
}

export interface Board {
    id: string;
    title: string;
    tasks: Task[];
}

export interface BoardAction {
    onEdit: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onReorder: (boards: Board[]) => void;
    onTaskAdd: (boardId: string, content: string) => void;
}
