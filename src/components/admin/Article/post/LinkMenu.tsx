import React, { useState, ChangeEvent } from "react";

interface Editor {
  chain: () => {
    focus: () => any;
    extendMarkRange: (mark: string) => any;
    setLink: (attrs: { href: string }) => any;
    unsetLink: () => any;
    run: () => void;
  };
  isActive: (mark: string) => boolean;
}

interface LinkMenuProps {
  editor: Editor | null;
  showLinkMenu: boolean;
  setShowLinkMenu: (value: boolean) => void;
}

const LinkMenu: React.FC<LinkMenuProps> = ({
  editor,
  showLinkMenu,
  setShowLinkMenu,
}) => {
  const [linkUrl, setLinkUrl] = useState("https://");

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Link URL changed:", e.target.value);
    setLinkUrl(e.target.value);
  };

  const addLink = () => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("https://");
      setShowLinkMenu(false);
    }
  };

  if (!showLinkMenu) return null;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md p-2 z-10 w-64 shadow-md">
      <div className="flex items-center">
        <input
          type="text"
          value={linkUrl}
          onChange={handleLinkChange}
          className="flex-1 px-2 py-1 border border-gray-300 rounded-md mr-2"
          placeholder="https://"
        />
        <button
          onClick={addLink}
          className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
        >
          Add
        </button>
      </div>
      {editor && editor.isActive("link") && (
        <div className="mt-2 flex justify-between">
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="text-red-500 text-sm"
          >
            Remove Link
          </button>
          <button
            onClick={() => setShowLinkMenu(false)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkMenu;
