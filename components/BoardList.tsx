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

        // 보드 간 할일 이동
        if (active.data.current?.type === "Task") {
            const taskId = active.id as string;
            const sourceBoardId = active.data.current.boardId;
            const targetBoardId = over.data.current?.boardId || over.id;

            if (sourceBoardId !== targetBoardId) {
                boardActions.moveTask(taskId, sourceBoardId, targetBoardId);
                return;
            }

            // 같은 보드 내 할일 순서 변경
            if (sourceBoardId === targetBoardId) {
                const board = boards.find((b) => b.id === sourceBoardId);
                if (!board) return;

                const oldIndex = board.tasks.findIndex((t) => t.id === taskId);
                const newIndex = board.tasks.findIndex((t) => t.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newTasks = arrayMove(
                        [...board.tasks],
                        oldIndex,
                        newIndex
                    );
                    boardActions.reorderTask(sourceBoardId, newTasks);
                }
            }
        }
        // 보드 순서 변경
        else if (active.id !== over.id) {
            const oldIndex = boards.findIndex(
                (board) => board.id === active.id
            );
            const newIndex = boards.findIndex((board) => board.id === over.id);
            boardActions.reorderBoards(arrayMove(boards, oldIndex, newIndex));
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
