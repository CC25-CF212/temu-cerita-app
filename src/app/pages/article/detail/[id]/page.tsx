"use client";
import { useEffect, useState } from "react";
import Header from "../../../../../components/pages/components/layout/Header";
import Footer from "../../../../../components/pages/components/layout/Footer";
import CommentSection from "@/components/pages/components/artikel/CommentSection";
import InteractiveGallery from "@/components/pages/components/InteractiveGallery";
import { galleryItems } from "@/data/galleryItems";
import { formatDistanceToNow } from "date-fns";
import { ar, id as tset } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

const CURRENT_USER_ID = 123; // Replace with actual user ID from auth

type Article = {
  id: string;
  title: string;
  author: { name: string };
  createdAt: string;
  content_html: string;
  images?: string[];
  category?: string;
};

type Comment = {
  id: number;
  name: string;
  time: string;
  text: string;
  likes: number;
  replies: number;
};

export default function ArticleDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [isMounted, setIsMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  // Di dalam component
  const { setArtikel } = useAuthStore(); // Ambil setArtikel dari store
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchArticle = async (articleId: string, userId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const hasil = await response.json();

      if (hasil.success) {
        setArticle(hasil.data);
        setLikes(hasil.data.likes || 0);
      } else {
        throw new Error(hasil.message || "Failed to fetch article");
      }
    } catch (err: any) {
      console.error("Error fetching article:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && CURRENT_USER_ID) {
      fetchArticle(id, CURRENT_USER_ID);
    }
  }, [id]);

  const handleLike = async (e: any, articleId: any) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = session?.user?.id;
    // Set artikel ID ke store saat user melakukan like
    //setArtikel(articleId);
    // Set artikel dan otomatis fetch recommendations
    const response = await fetch(`/api/articles/likes/${articleId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      console.error("Gagal menyukai artikel.");
      return;
    }
    console.log("Like berhasil:", await response.json());
    await setArtikel(articleId);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const handleBookmark = async (e: any, articleId: any) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("User belum login.");
      return;
    }

    try {
      const response = await fetch(`/api/articles/saved/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.error("Gagal menyimpan artikel.");
        return;
      }
      const hasil = await response.json();
      console.log("Simpan artikel berhasil:", hasil);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan artikel:", error);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-5 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-4/4 lg:pr-8">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h3 className="font-medium">
                  {article?.author.name || "Unknown Author"}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    {article?.createdAt
                      ? formatDistanceToNow(new Date(article.createdAt), {
                          addSuffix: true,
                          locale: tset,
                        })
                      : "Unknown time"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {article?.createdAt
                      ? new Date(article.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Unknown Date"}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {article?.title || "Loading..."}
            </h1>

            <InteractiveGallery
              galleryItems={
                article?.images?.map((imageUrl, index) => ({
                  type: "image" as const,
                  src: imageUrl,
                  alt: `Article image ${index + 1}`,
                  caption: `Image ${index + 1} from the article`,
                })) || galleryItems
              }
              className="mb-8"
            />

            {article?.content_html && (
              <div className="prose max-w-none mb-8">
                <div
                  dangerouslySetInnerHTML={{ __html: article.content_html }}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {article?.category}
              </span>
            </div>
            <div className="flex items-center gap-4 py-4 border-y border-gray-200 mb-8">
              <button
                onClick={(e) => article && handleLike(e, article.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                <span>{likes}</span>
              </button>

              <button
                onClick={(e) => article && handleBookmark(e, article.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{isBookmarked ? "🔖" : "📄"}</span>
                <span>Bookmark</span>
              </button>
            </div>
            {article?.id && session?.user?.id && session?.user?.name ? (
              <CommentSection
                articleId={article.id}
                currentUserId={session.user.id}
                namaUser={session.user.name}
              />
            ) : (
              <div>Loading komentar...</div> // Bisa ganti jadi spinner atau skeleton
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
