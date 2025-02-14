// components/Board/BoardList.tsx
import { Board } from "@/types";

type Props = {
    boards: Board[];
};

export default function BoardList({ boards }: Props) {
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
                <div
                    key={board.id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                    <h3 className="text-lg font-semibold">{board.title}</h3>
                </div>
            ))}
        </div>
    );
}
