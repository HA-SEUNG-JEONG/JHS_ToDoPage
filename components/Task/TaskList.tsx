// components/Board/TaskList.tsx
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { BoardAction, Task } from "@/types";
import TaskItem from "./TaskItem";

type TaskListProps = {
    tasks: Task[];
    boardId: string;
    boardActions: BoardAction;
};

export default function TaskList({
    tasks = [],
    boardId,
    boardActions
}: TaskListProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: boardId,
        data: {
            type: "Board",
            boardId: boardId
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] rounded-lg transition-colors ${
                isOver ? "bg-blue-50" : "bg-transparent"
            }`}
        >
            <SortableContext
                items={tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul className="mt-3 space-y-2">
                    {tasks.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-gray-500 text-center">
                            {isOver ? "여기에 놓기" : "할 일이 없습니다"}
                        </li>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                boardId={boardId}
                                boardActions={boardActions}
                            />
                        ))
                    )}
                </ul>
            </SortableContext>
        </div>
    );
}
