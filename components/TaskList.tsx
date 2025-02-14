import { Task } from "@/types";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Task[];
    boardId: string;
    onTaskEdit: (boardId: string, taskId: string, title: string) => void;
    onTaskDelete: (boardId: string, taskId: string) => void;
};

export default function TaskList({
    tasks,
    boardId,
    onTaskEdit,
    onTaskDelete
}: Props) {
    if (tasks?.length === 0) return null;

    return (
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
    );
}
