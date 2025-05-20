"use client";
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { createRoot } from "react-dom/client";
import SideMenu from "@/components/SideMenu";
import FormInput from "@/components/FormInput";
import EditorToolbar from "@/components/admin/Article/post/EditorToolbar";
import MediaGallery from "@/components/admin/Article/post/MediaGallery";
// Action Buttons Component
const ActionButtons = () => {
  const handleSaveDraft = () => {
    console.log("Saving draft...");
    // Implement save draft functionality
  };

  const handlePublish = () => {
    console.log("Publishing story...");
    // Implement publish functionality
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleSaveDraft}
        className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
      >
        Save
      </button>
      <button
        onClick={handlePublish}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Reset
      </button>
    </div>
  );
};

// Main Editor Component
const StoryEditor = () => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your story here...",
      }),
      Image,
      Link,
    ],
    content: "",
  });

  const handleImageUpload = (e) => {
    console.log("Image upload triggered");
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newMediaItems = newFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "image",
        file,
        url: URL.createObjectURL(file),
      }));

      console.log("New media items:", newMediaItems);
      setMediaItems([...mediaItems, ...newMediaItems]);

      // Insert first image at cursor position if there are no images yet
      if (mediaItems.length === 0 && editor && newMediaItems.length > 0) {
        editor.chain().focus().setImage({ src: newMediaItems[0].url }).run();
      }
    }
  };

  const handleVideoUpload = (e) => {
    console.log("Video upload triggered");
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newVideo = {
        id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "video",
        file,
        url: URL.createObjectURL(file),
      };

      console.log("New video:", newVideo);
      setMediaItems([...mediaItems, newVideo]);
    }
  };

  const removeMedia = (id) => {
    console.log("Removing media:", id);
    setMediaItems(mediaItems.filter((item) => item.id !== id));
    if (currentSlide >= mediaItems.length - 1) {
      setCurrentSlide(Math.max(0, mediaItems.length - 2));
    }
  };

  const insertMediaToEditor = (item) => {
    if (!editor) return;

    console.log("Inserting media to editor:", item);
    if (item.type === "image") {
      editor.chain().focus().setImage({ src: item.url }).run();
    } else {
      // Insert video as HTML
      const videoHtml = `<div class="video-wrapper"><video controls><source src="${item.url}" type="${item.file.type}"></video></div>`;
      editor.commands.insertContent(videoHtml);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Article</h1>

      {/* Title Input Component */}
      {/* <TitleInput title={title} setTitle={setTitle} /> */}
      <FormInput label="Title" value={title} onChange={setTitle} />
      <FormInput label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
      <FormInput label="Categorie" value={category} onChange={setCategory} />
      {/* Media Gallery Component */}
      <MediaGallery
        mediaItems={mediaItems}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        removeMedia={removeMedia}
        insertMediaToEditor={insertMediaToEditor}
      />

      {/* Editor Component */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-300">
        <EditorToolbar
          editor={editor}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
        />
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>

      {/* Action Buttons Component */}
      <ActionButtons />

      <style jsx global>{`
        /* Editor styles */
        .ProseMirror {
          min-height: 300px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        /* Prose styling */
        .prose h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .prose p {
          margin-bottom: 0.75rem;
        }
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        .prose ul,
        .prose ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .prose ul {
          list-style-type: disc;
        }
        .prose ol {
          list-style-type: decimal;
        }
        .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        .prose .video-wrapper {
          margin: 1rem 0;
        }
        .prose .video-wrapper video {
          max-width: 100%;
        }
        /* Slider styles */
        .slider-content {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};
export default function ArticlePostPage() {
  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    if (container && container.childNodes.length === 0) {
      const root = createRoot(container);
      root.render(<SideMenu />);
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <StoryEditor />
    </div>
  );
}
