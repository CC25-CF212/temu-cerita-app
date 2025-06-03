"use client";
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import SideMenu from "@/components/SideMenu";
import FormInput from "@/components/FormInput";
import EditorToolbar from "@/components/admin/Article/post/EditorToolbar";
import MediaGallery from "@/components/admin/Article/post/MediaGallery";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
// Biasanya di _app.js atau layout.js
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientSelect from "@/components/ClientSelect";
const ActionButtons = ({ articleData, onSaveDraft, onPublish }) => {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-5 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <button
        onClick={onPublish}
        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Save
      </button>

      {/* <button
        onClick={onSaveDraft}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Reset
      </button> */}
    </div>
  );
};

// Main Editor Component
const StoryEditor = ({ articleId }) => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [kategoriList, setKategoriList] = useState([]);
  const router = useRouter();
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
  async function urlToFile(url, filename, mimeType = "image/jpeg") {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  // Fetch existing article data on mount if articleId is provided
  useEffect(() => {
    if (!articleId) {
      setIsLoading(false);
      return;
    }
    const fetchKategori = async () => {
      const res = await fetch("/api/kategori");
      if (res.ok) {
        const data = await res.json();
        setKategoriList(data);
      }
    };
    fetchKategori();
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
          throw new Error("Could not fetch article data");
        }
        const hasil = await response.json();
        // Populate form fields
        setTitle(hasil.data.title || "");
        setThumbnail(hasil.data.thumbnail_url || "");
        setCategory(hasil.data.categories[0].id || "");
        const mediaItems = await Promise.all(
          hasil.data.images.map(async (url, index) => {
            const filename = url.split("/").pop();
            const file = await urlToFile(url, filename); // Buat File dari URL

            return {
              id: `image-${index}`,
              url: url,
              file: file, // File hasil convert dari URL
              type: "image",
              alt: "",
              name: filename,
              size: file.size,
            };
          })
        );

        console.log("Fetched media items:", mediaItems);
        setMediaItems(mediaItems || []);
        //Set editor content after ensuring editor is ready
        if (editor) {
          editor.commands.setContent(hasil.data.content_html || "");
        }
      } catch (error) {
        console.error("Error loading article", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, editor]);

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
  const articleData = {
    title,
    thumbnail,
    category,
    content: editor?.getHTML(), // Get the HTML content from the editor
    mediaItems,
  };

  // Example stub functions for API calls
  const saveDraft = async () => {
    try {
      const res = await fetch("/api/articles/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...articleData, id: articleId }),
      });
      if (!res.ok) throw new Error("Failed to save draft");
      const result = await res.json();
      console.log("Draft saved", result);
    } catch (error) {
      console.error(error);
    }
  };
  const publishArticle = async () => {
    try {
      const formData = new FormData();

      // Tambahkan field teks
      formData.append("title", articleData.title);
      formData.append("content_html", articleData.content);
      formData.append("category", articleData.category);
      // Tambahkan file gambar/video
      mediaItems.forEach((item) => {
        formData.append("images", item.file);
      });

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal submit artikel");
      }
      toast.success(
        <div className="flex flex-col items-center justify-center text-center px-4 py-3">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <p className="text-lg font-semibold mb-2">{result.message}</p>
          <button
            onClick={() => router.back()} // atau router.push('/dashboard')
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          icon: false, // biar tidak ada icon
          closeButton: false, // biar tidak ada X
          hideProgressBar: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) return <div>Loading article data...</div>;
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Article</h1>
      <FormInput label="Title" value={title} onChange={setTitle} />
      <FormInput label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
      {/* <FormInput label="Categorie" value={category} onChange={setCategory} /> */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori *
        </label>
        <ClientSelect
          options={kategoriList.map((item) => ({
            value: item.id,
            label: item.nama,
          }))}
          value={category}
          onChange={setCategory}
        />
      </div>
      <MediaGallery
        mediaItems={mediaItems}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        removeMedia={removeMedia}
        insertMediaToEditor={insertMediaToEditor}
      />
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-300">
        <EditorToolbar
          editor={editor}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
        />
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>

      {/* Action Buttons Component */}
      <ActionButtons
        articleData={articleData}
        onSaveDraft={saveDraft}
        onPublish={publishArticle}
      />

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
  const [sideMenuContainer, setSideMenuContainer] = useState(null);
  const params = useParams();
  const articleId = params.id;

  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);

  return (
    <>
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}

      <div className="bg-white p-4 rounded-lg shadow">
        <StoryEditor articleId={articleId} />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={false} // jangan auto close kalau ada tombol manual
        closeOnClick={false}
        draggable={false}
      />
    </>
  );
}
