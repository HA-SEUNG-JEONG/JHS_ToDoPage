
import { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { Board } from "@/types";
import { boardReducer, Action } from "@/reducers/boardReducer";
import { storageUtil } from "@/utils/storage";

interface BoardContextType {
    boards: Board[];
    dispatch: React.Dispatch<Action>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const DEFAULT_BOARDS: Omit<Board, "id">[] = [
    { title: "To do", tasks: [] },
    { title: "In Progress", tasks: [] },
    { title: "Done", tasks: [] }
];

export const BoardProvider = ({ children }: { children: ReactNode }) => {
    const [boards, dispatch] = useReducer(boardReducer, [], () => {
        const savedBoards = storageUtil.getBoards();
        if (savedBoards.length > 0) {
            return savedBoards;
        }
        return DEFAULT_BOARDS.map((board) => ({ ...board, id: crypto.randomUUID() }));
    });

    useEffect(() => {
        storageUtil.saveBoards(boards);
    }, [boards]);

    return (
        <BoardContext.Provider value={{ boards, dispatch }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoards = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error("useBoards must be used within a BoardProvider");
    }
    return context;
};
