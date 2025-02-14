// components/Board/BoardList.tsx
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Board, BoardAction } from "@/types";
import SortableBoardItem from "./SortableBoardItem";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

type Props = {
    boards: Board[];
    boardActions: BoardAction;
};

export default function BoardList({ boards, boardActions }: Props) {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        // if (over && active.id !== over.id) {
        //     const oldIndex = boards.findIndex(
        //         (board) => board.id === active.id
        //     );
        //     const newIndex = boards.findIndex((board) => board.id === over.id);
        //     const reorderedBoards = arrayMove(boards, oldIndex, newIndex);
        //     boardActions.onReorder(reorderedBoards);
        // }

        if (active.data.current?.type === "Task") {
            const taskId = active.id as string;
            console.log("taskId: ", taskId);
            const sourceBoardId = active.data.current.boardId;
            console.log("sourceBoardId: ", sourceBoardId);
            const targetBoardId = over.data.current?.boardId;
            console.log("targetBoardId: ", targetBoardId);

            if (sourceBoardId !== targetBoardId) {
                boardActions.onTaskMove(taskId, sourceBoardId, targetBoardId);
            }
        }
    };

    if (boards.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                생성된 보드가 없습니다.
            </div>
        );
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
        >
            <SortableContext items={boards.map((board) => board.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map((board) => (
                        <SortableBoardItem
                            key={board.id}
                            board={board}
                            boardActions={boardActions}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
