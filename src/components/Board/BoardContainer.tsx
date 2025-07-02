import { useBoards } from "@/context/BoardContext";
import BoardList from "./BoardList";
import CreateBoardForm from "./CreateBoardForm";

export default function BoardContainer() {
    const { boards, dispatch } = useBoards();

    const createBoard = (title: string) => {
        dispatch({ type: "ADD_BOARD", payload: { title } });
    };

    return (
        <div className="p-6 select-none">
            <CreateBoardForm onSubmit={createBoard} />
            <BoardList boards={boards} />
        </div>
    );
}
