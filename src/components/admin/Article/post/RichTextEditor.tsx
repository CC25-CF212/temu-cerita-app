// File: components/Editor/RichTextEditor.tsx
import React, { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatDoc = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentChange();
    }
  };

  return (
    <div className="border rounded overflow-hidden">
      <div className="flex bg-gray-100 border-b p-1">
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => formatDoc("bold")}
          title="Bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 12h6m6 0H6m6 0V6m0 12v-6"
            />
          </svg>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => formatDoc("italic")}
          title="Italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 12h6"
            />
          </svg>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => {
            const url = prompt("Enter the URL");
            if (url) formatDoc("createLink", url);
          }}
          title="Link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </div>
      <div
        ref={editorRef}
        className="p-2 min-h-[200px] focus:outline-none"
        contentEditable
        onBlur={handleContentChange}
        onInput={handleContentChange}
      ></div>
    </div>
  );
};

export default RichTextEditor;
