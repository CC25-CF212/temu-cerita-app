// File: components/Article/ArticleForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
});

interface ArticleFormProps {
  initialData?: {
    title: string;
    thumbnail: string;
    category: string;
    content: string;
  };
  onSubmit: (data: any) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData = { title: "", thumbnail: "", category: "", content: "" },
  onSubmit,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.thumbnail.trim())
      newErrors.thumbnail = "Thumbnail is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Add Article</h2>
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.thumbnail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Main <span className="text-red-500">*</span>
          </label>
          <Editor value={formData.content} onChange={handleEditorChange} />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
