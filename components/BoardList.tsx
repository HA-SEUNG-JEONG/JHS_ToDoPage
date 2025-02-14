import { Board, BoardAction } from "@/types";
import BoardItem from "./BoardItem";

type Props = {
    boards: Board[];
    onEdit: BoardAction["onEdit"];
};

export default function BoardList({ boards, onEdit }: Props) {
    if (boards.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                생성된 보드가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
                <BoardItem key={board.id} board={board} onEdit={onEdit} />
            ))}
        </div>
    );
}
