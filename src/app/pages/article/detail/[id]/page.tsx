"use client";
import { useEffect, useState } from "react";
import Header from "../../../../../components/pages/components/layout/Header";
import Footer from "../../../../../components/pages/components/layout/Footer";
import SidebarArticle from "@/components/pages/components/SidebarArticle";
import CommentSection from "@/components/pages/components/artikel/CommentSection";
import InteractiveGallery from "@/components/pages/components/InteractiveGallery";
import { galleryItems } from "@/data/galleryItems";
import { formatDistanceToNow } from "date-fns";
import { id as tset } from "date-fns/locale";
import { useParams } from "next/navigation";

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
  const [likes, setLikes] = useState(25);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Syntia",
      time: "3 day",
      text: "looks a lot like VS Code ... oh, that's indeed VS Code 😉",
      likes: 45,
      replies: 5,
    },
    {
      id: 2,
      name: "Budi Pratama",
      time: "2 day",
      text: "Great article! I've been looking for ways to integrate LangGraph with BigQuery. This is exactly what I needed.",
      likes: 23,
      replies: 2,
    },
  ]);

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

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([
        {
          id: comments.length + 1,
          name: "You",
          time: "Just now",
          text: commentText,
          likes: 0,
          replies: 0,
        },
        ...comments,
      ]);
      setCommentText("");
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

            <CommentSection
              articleId={Number(id)}
              currentUserId={CURRENT_USER_ID}
              apiEndpoint="/api/comments"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
