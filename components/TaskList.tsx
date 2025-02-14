// components/Board/TaskList.tsx
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Task } from "@/types";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Task[];
    boardId: string;
    onTaskEdit: (boardId: string, taskId: string, title: string) => void;
    onTaskDelete: (boardId: string, taskId: string) => void;
};

export default function TaskList({
    tasks = [],
    boardId,
    onTaskEdit,
    onTaskDelete
}: Props) {
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
                                onEdit={onTaskEdit}
                                onDelete={onTaskDelete}
                            />
                        ))
                    )}
                </ul>
            </SortableContext>
        </div>
    );
}
