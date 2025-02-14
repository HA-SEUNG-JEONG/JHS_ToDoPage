// components/Board/TaskList.tsx
import { Task } from "@/types";

type Props = {
    tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
    if (tasks?.length === 0) return null;

    return (
        <ul className="mt-3 space-y-2">
            {tasks?.map((task) => (
                <li
                    key={task.id}
                    className="px-3 py-2 bg-gray-50 rounded-lg text-sm shadow-sm text-black"
                >
                    {task.title}
                </li>
            ))}
        </ul>
    );
}
