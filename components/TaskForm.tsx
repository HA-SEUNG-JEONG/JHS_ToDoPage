// components/Board/TaskForm.tsx
import { useState } from "react";

type Props = {
    onSubmit: (title: string) => void;
};

export default function TaskForm({ onSubmit }: Props) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title);
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="새 할 일 추가"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    maxLength={100}
                />
                <button
                    type="submit"
                    className="px-3 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={!title.trim()}
                >
                    추가
                </button>
            </div>
        </form>
    );
}
