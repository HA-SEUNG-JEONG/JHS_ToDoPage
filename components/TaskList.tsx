import { Task } from "@/types";
import TaskItem from "./TaskItem";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

type Props = {
    tasks: Task[];
    boardId: string;
    onTaskEdit: (boardId: string, taskId: string, title: string) => void;
    onTaskDelete: (boardId: string, taskId: string) => void;
    onTaskReorder: (boardId: string, tasks: Task[]) => void;
};

export default function TaskList({
    tasks = [],
    boardId,
    onTaskEdit,
    onTaskDelete,
    onTaskReorder
}: Props) {
    if (tasks?.length === 0) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((task) => task.id === active.id);
            const newIndex = tasks.findIndex((task) => task.id === over.id);
            const reorderedIndex = arrayMove(tasks, oldIndex, newIndex);

            onTaskReorder(boardId, reorderedIndex);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
                items={tasks?.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul className="mt-3 space-y-2">
                    {tasks?.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            boardId={boardId}
                            onEdit={onTaskEdit}
                            onDelete={onTaskDelete}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}
