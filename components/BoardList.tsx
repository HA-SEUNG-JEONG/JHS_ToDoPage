import { Board, BoardAction } from "@/types";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableBoardItem from "./SortableBoardItem";

type Props = {
    boards: Board[];
    onEdit: BoardAction["onEdit"];
    onDelete: BoardAction["onDelete"];
    onReorder: BoardAction["onReorder"];
};

export default function BoardList({
    boards,
    onEdit,
    onDelete,
    onReorder
}: Props) {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = boards.findIndex(
                (board) => board.id === active.id
            );
            const newIndex = boards.findIndex((board) => board.id === over.id);
            const reorderBoards = arrayMove(boards, oldIndex, newIndex);
            onReorder(reorderBoards);
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
        >
            <SortableContext items={boards.map((board) => board.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map((board) => (
                        <SortableBoardItem
                            key={board.id}
                            board={board}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
