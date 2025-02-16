import {
    Active,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    Over,
    TouchSensor,
    UniqueIdentifier,
    closestCenter,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Board, BoardAction, Task } from "@/types";
import SortableBoardItem from "./SortableBoardItem";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useState } from "react";

type Props = {
    boards: Board[];
    boardActions: BoardAction;
};

export default function BoardList({ boards, boardActions }: Props) {
    const [activeId, setActiveId] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5
            }
        })
    );

    const moveTaskBetweenBoard = (active: Active, over: Over) => {
        const { id } = active;
        const sourceBoardId: string = active.data.current?.boardId;
        const targetBoardId: string = over.data.current?.boardId || over.id;
        if (sourceBoardId !== targetBoardId) {
            boardActions.moveTaskBetweenBoards(
                id,
                sourceBoardId,
                targetBoardId
            );
            return;
        }
    };

    const moveTaskInBoard = (active: Active, over: Over) => {
        const { id } = active;
        const sourceBoardId: string = active.data.current?.boardId;
        const targetBoardId: string = over.data.current?.boardId;

        if (sourceBoardId === targetBoardId) {
            const board = boards.find((board) => board.id === sourceBoardId);
            if (!board) return;

            const oldIndex = board.tasks.findIndex((task) => task.id === id);
            const newIndex = board.tasks.findIndex(
                (task) => task.id === over.id
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                const newTasks = arrayMove(
                    [...board.tasks],
                    oldIndex,
                    newIndex
                );
                boardActions.reorderTaskInBoard(sourceBoardId, newTasks);
            }
        }
    };

    const moveBoard = (
        activeId: UniqueIdentifier,
        overId: UniqueIdentifier
    ) => {
        const oldIndex = boards.findIndex((board) => board.id === activeId);
        const newIndex = boards.findIndex((board) => board.id === overId);
        boardActions.reorderBoards(arrayMove(boards, oldIndex, newIndex));
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Task") {
            setActiveId(event.active.data.current.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        // 보드 간 할일 이동
        if (active.data.current?.type === "Task") {
            // 보드 간 할 일 순서 변경
            moveTaskBetweenBoard(active, over);
            // 같은 보드 내 할일 순서 변경
            moveTaskInBoard(active, over);
        }
        // 보드 순서 변경
        else if (active.data.current?.type === "Board") {
            moveBoard(active.id, over.id);
        }
        setActiveId(null);
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
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
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
            <DragOverlay>
                {activeId ? (
                    <div className="bg-blue-300 p-4 text-white rounded shadow-lg z-[999]">
                        {activeId.title}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
