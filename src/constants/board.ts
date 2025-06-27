export interface BoardStatus {
    title: string;
    color: string;
    text: string;
}

export const BOARD_STATUSES: Record<string, BoardStatus> = {
    "To do": {
        title: "To do",
        color: "bg-gray-100 text-gray-800",
        text: "할 일"
    },
    "In Progress": {
        title: "In Progress",
        color: "bg-blue-100 text-blue-800",
        text: "진행 중"
    },
    Done: {
        title: "Done",
        color: "bg-green-100 text-green-800",
        text: "완료"
    }
};

export const DEFAULT_BOARD_STATUS: BoardStatus = {
    title: "To do",
    color: "bg-gray-100 text-gray-800",
    text: "할 일"
};
