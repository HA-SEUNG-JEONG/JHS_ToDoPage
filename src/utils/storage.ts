import { Board } from "@/types";

const STORAGE_KEY = "kanban-boards";

export const storageUtil = {
    getBoards: (): Board[] => {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveBoards: (boards: Board[]): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    }
};
