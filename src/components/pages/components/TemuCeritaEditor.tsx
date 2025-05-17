import { useState } from "react";
import { Bold, Italic, Link, Image } from "lucide-react";

export default function TemuCerita() {
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("Write Here....");

  return (
    <div className="w-full max-w-3xl bg-gray-50 rounded-lg shadow-md p-6 mb-16">
      {/* Title & content area */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-serif text-gray-700 border-none outline-none mb-4 bg-transparent"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 text-gray-600 border-none outline-none resize-none bg-transparent"
        />
      </div>

      {/* Formatting toolbar */}
      <div className="border-t border-gray-200 pt-4 flex justify-between items-center bg-white shadow-sm rounded-md px-4 py-3">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Image size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Bold size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Italic size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Link size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1 text-gray-500 text-sm hover:underline">
            Cancel
          </button>
          <button className="px-4 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
