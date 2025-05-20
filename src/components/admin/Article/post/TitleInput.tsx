import React, { ChangeEvent } from "react";

interface TitleInputProps {
  title: string;
  setTitle: (value: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Title changed:", e.target.value);
    setTitle(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter story title..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
      />
    </div>
  );
};

export default TitleInput;
