import { useState } from "react";

type Props = {
    onSubmit: (title: string) => void;
};

export default function CreateBoardForm({ onSubmit }: Props) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title);
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 select-none">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="보드 제목을 입력하세요"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    maxLength={50}
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!title.trim()}
                >
                    생성
                </button>
            </div>
        </form>
    );
}
