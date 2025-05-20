import {
  Bold,
  Code,
  Film,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { useRef, useState } from "react";
import LinkMenu from "./LinkMenu";

// Editor Toolbar Component
const EditorToolbar = ({ editor, onImageUpload, onVideoUpload }) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [showLinkMenu, setShowLinkMenu] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 bg-white flex flex-wrap gap-1 items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
        title="Quote"
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-md hover:bg-gray-100 ${
          editor.isActive("code") ? "bg-gray-200" : ""
        }`}
        title="Code"
      >
        <Code size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Link button */}
      <div className="relative">
        <button
          onClick={() => setShowLinkMenu(!showLinkMenu)}
          className={`p-2 rounded-md hover:bg-gray-100 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>
        <LinkMenu
          editor={editor}
          showLinkMenu={showLinkMenu}
          setShowLinkMenu={setShowLinkMenu}
        />
      </div>

      {/* Image upload button */}
      <div>
        <input
          type="file"
          ref={imageInputRef}
          onChange={onImageUpload}
          className="hidden"
          accept="image/*"
          multiple
        />
        <button
          onClick={() => imageInputRef.current?.click()}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Upload Images"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Video upload button */}
      <div>
        <input
          type="file"
          ref={videoInputRef}
          onChange={onVideoUpload}
          className="hidden"
          accept="video/*"
        />
        <button
          onClick={() => videoInputRef.current?.click()}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Upload Video"
        >
          <Film size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded-md hover:bg-gray-100"
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded-md hover:bg-gray-100"
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};
export default EditorToolbar;
