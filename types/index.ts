export interface Board {
    id: string;
    title: string;
}

export type BoardAction = {
    onEdit: (id: string, title: string) => void;
    onDelete: (id: string) => void;
};
