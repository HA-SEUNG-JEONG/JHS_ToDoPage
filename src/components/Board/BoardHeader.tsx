import {
    BOARD_STATUSES,
    DEFAULT_BOARD_STATUS
} from "@/constants/board";

interface BoardHeaderProps {
    title: string;
    taskCount: number;
    isEditing: boolean;
    editTitle: string;
    onEditTitleChange: (value: string) => void;
    onEditSubmit: (e: React.FormEvent) => void;
    onEditCancel: () => void;
    onEditClick: () => void;
    onDeleteClick: (e: React.MouseEvent) => void;
}

export default function BoardHeader({
    title,
    taskCount,
    isEditing,
    editTitle,
    onEditTitleChange,
    onEditSubmit,
    onEditCancel,
    onEditClick,
    onDeleteClick
}: BoardHeaderProps) {
    const status = BOARD_STATUSES[title] || DEFAULT_BOARD_STATUS;

    if (isEditing) {
        return (
            <form
                onSubmit={onEditSubmit}
                className="flex items-center gap-2 w-full"
            >
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => onEditTitleChange(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    maxLength={50}
                />
                <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={onEditCancel}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    취소
                </button>
            </form>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <span
                    className={`px-2 py-1 text-xs rounded-full ${status.color}`}
                >
                    {status.text}
                </span>
                <span className="text-xs text-gray-500">
                    ({taskCount}개의 항목)
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onEditClick}
                    className="text-gray-500 hover:text-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                    </svg>
                </button>
                <button
                    onClick={onDeleteClick}
                    className="text-gray-500 hover:text-red-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
