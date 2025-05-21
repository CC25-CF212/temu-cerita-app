"use client";
import { useState, useRef } from "react";
import Footer from "@/components/pages/components/layout/Footer";
import Header from "@/components/pages/components/layout/Header";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Head from "next/head";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Code,
  LinkIcon,
  Image as ImageIcon,
  Film,
  Paperclip,
  X,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Editor toolbar component
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  onVideoUpload,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [showLinkMenu, setShowLinkMenu] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("https://");

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      // Update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();

      // Reset and close
      setLinkUrl("https://");
      setShowLinkMenu(false);
    }
  };

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

        {showLinkMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md p-2 z-10 w-64 shadow-md">
            <div className="flex items-center">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
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
            {editor.isActive("link") && (
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
        )}
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

interface MediaItem {
  id: string;
  type: "image" | "video";
  file: File;
  url: string;
}

export default function EditorPage() {
  const [title, setTitle] = useState<string>("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newMediaItems: MediaItem[] = newFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "image",
        file,
        url: URL.createObjectURL(file),
      }));

      setMediaItems([...mediaItems, ...newMediaItems]);

      // Insert first image at cursor position if there are no images yet
      if (mediaItems.length === 0 && editor && newMediaItems.length > 0) {
        editor.chain().focus().setImage({ src: newMediaItems[0].url }).run();
      }
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newVideo: MediaItem = {
        id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "video",
        file,
        url: URL.createObjectURL(file),
      };

      setMediaItems([...mediaItems, newVideo]);

      // We don't auto-insert video to the editor as it might be disruptive
      // User can manually place it with the media gallery
    }
  };

  const removeMedia = (id: string) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id));
    if (currentSlide >= mediaItems.length - 1) {
      setCurrentSlide(Math.max(0, mediaItems.length - 2));
    }
  };

  const insertMediaToEditor = (item: MediaItem) => {
    if (!editor) return;

    if (item.type === "image") {
      editor.chain().focus().setImage({ src: item.url }).run();
    } else {
      // Insert video as HTML
      const videoHtml = `<div class="video-wrapper"><video controls><source src="${item.url}" type="${item.file.type}"></video></div>`;
      editor.commands.insertContent(videoHtml);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>
          {title ? `${title} - TemuCerita` : "Create Story - TemuCerita"}
        </title>
        <meta
          name="description"
          content={`Create and share your stories on TemuCerita`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Story</h1>

          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter story title..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
            />
          </div>

          {/* Media Gallery / Slider */}
          {mediaItems.length > 0 && (
            <div className="mb-6 border border-gray-300 rounded-lg bg-white overflow-hidden">
              <div className="relative">
                {/* Current slide */}
                <div className="slider-content h-64 flex items-center justify-center bg-gray-100">
                  {mediaItems[currentSlide].type === "image" ? (
                    <img
                      src={mediaItems[currentSlide].url}
                      alt="Uploaded content"
                      className="max-h-64 max-w-full object-contain"
                    />
                  ) : (
                    <video
                      src={mediaItems[currentSlide].url}
                      controls
                      className="max-h-64 max-w-full"
                    />
                  )}
                </div>

                {/* Navigation arrows */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          prev === 0 ? mediaItems.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          prev === mediaItems.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex overflow-x-auto p-2 bg-gray-50 gap-2">
                {mediaItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative cursor-pointer flex-shrink-0 ${
                      currentSlide === index ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded-md">
                        <Film size={24} className="text-gray-600" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(item.id);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end p-2 border-t border-gray-200">
                <button
                  onClick={() => insertMediaToEditor(mediaItems[currentSlide])}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  <Paperclip size={14} className="mr-1" />
                  Insert into text
                </button>
              </div>
            </div>
          )}

          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-300">
            <EditorToolbar
              editor={editor}
              onImageUpload={handleImageUpload}
              onVideoUpload={handleVideoUpload}
            />
            <EditorContent editor={editor} className="prose max-w-none p-4" />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Publish
            </button>
          </div>
        </div>
      </main>

      <Footer />

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
}
