
import { Board, Task, TaskStatus } from "@/types";

export type Action =
    | { type: "INITIALIZE_BOARDS"; payload: Board[] }
    | { type: "ADD_BOARD"; payload: { title: string } }
    | { type: "EDIT_BOARD_TITLE"; payload: { id: string; newTitle: string } }
    | { type: "DELETE_BOARD"; payload: { id: string } }
    | { type: "REORDER_BOARDS"; payload: Board[] }
    | { type: "ADD_TASK"; payload: { boardId: string; title: string } }
    | { type: "EDIT_TASK"; payload: { boardId: string; taskId: string; newTitle: string } }
    | { type: "DELETE_TASK"; payload: { boardId: string; taskId: string } }
    | { type: "REORDER_TASK_IN_BOARD"; payload: { boardId: string; tasks: Task[] } }
    | {
          type: "MOVE_TASK_BETWEEN_BOARDS";
          payload: { taskId: string; sourceBoardId: string; targetBoardId: string };
      };

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

export const boardReducer = (state: Board[], action: Action): Board[] => {
    switch (action.type) {
        case "INITIALIZE_BOARDS":
            return action.payload;

        case "ADD_BOARD": {
            const newBoard: Board = {
                id: crypto.randomUUID(),
                title: action.payload.title,
                tasks: []
            };
            return [...state, newBoard];
        }

        case "EDIT_BOARD_TITLE": {
            return state.map((board) =>
                board.id === action.payload.id
                    ? { ...board, title: action.payload.newTitle }
                    : board
            );
        }

        case "DELETE_BOARD": {
            return state.filter((board) => board.id !== action.payload.id);
        }

        case "REORDER_BOARDS": {
            return action.payload;
        }

        case "ADD_TASK": {
            const board = state.find((b) => b.id === action.payload.boardId);
            if (!board) return state;

            const newTask: Task = {
                id: crypto.randomUUID(),
                title: action.payload.title,
                boardId: action.payload.boardId,
                status: getTaskStatus(board.title)
            };

            return state.map((b) =>
                b.id === action.payload.boardId
                    ? { ...b, tasks: [...b.tasks, newTask] }
                    : b
            );
        }

        case "EDIT_TASK": {
            return state.map((board) => {
                if (board.id !== action.payload.boardId) return board;
                const updatedTasks = board.tasks.map((task) =>
                    task.id === action.payload.taskId
                        ? { ...task, title: action.payload.newTitle }
                        : task
                );
                return { ...board, tasks: updatedTasks };
            });
        }

        case "DELETE_TASK": {
            return state.map((board) => {
                if (board.id === action.payload.boardId) {
                    return {
                        ...board,
                        tasks: board.tasks.filter(
                            (task) => task.id !== action.payload.taskId
                        )
                    };
                }
                return board;
            });
        }

        case "REORDER_TASK_IN_BOARD": {
            return state.map((board) =>
                board.id === action.payload.boardId
                    ? { ...board, tasks: action.payload.tasks }
                    : board
            );
        }

        case "MOVE_TASK_BETWEEN_BOARDS": {
            const { taskId, sourceBoardId, targetBoardId } = action.payload;
            const sourceBoard = state.find((b) => b.id === sourceBoardId);
            const targetBoard = state.find((b) => b.id === targetBoardId);
            if (!sourceBoard || !targetBoard) return state;

            const taskToMove = sourceBoard.tasks.find(
                (task) => task.id === taskId
            );
            if (!taskToMove) return state;

            const newStatus = getTaskStatus(targetBoard.title);
            const updatedTask = {
                ...taskToMove,
                boardId: targetBoardId,
                status: newStatus
            };

            return state.map((board) => {
                if (board.id === sourceBoardId) {
                    return {
                        ...board,
                        tasks: board.tasks.filter((t) => t.id !== taskId)
                    };
                }
                if (board.id === targetBoardId) {
                    return { ...board, tasks: [...board.tasks, updatedTask] };
                }
                return board;
            });
        }

        default:
            return state;
    }
};
