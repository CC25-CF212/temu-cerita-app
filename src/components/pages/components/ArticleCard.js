import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import ShareDropdown from "./artikel/ShareDropdown";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

const ArticleCard = ({ article }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const { data: session } = useSession();
  const { setArtikel } = useAuthStore(); // Ambil setArtikel dari store
  // Handler untuk like artikel
  const handleLike = async (e, articleId) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = session?.user?.id;

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
    const hasil = await response.json();
    await setArtikel(articleId);
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  // Handler untuk menyimpan artikel
  // const handleSave = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsSaved(!isSaved);
  // };
  const handleSave = async (e, articleId) => {
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
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan artikel:", error);
    }
  };
  // Handler untuk bagikan artikel
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implementasi share functionality di sini
    alert(`Artikel "${article.title}" dibagikan!`);
  };

  return (
    <div className="border-b border-gray-200 py-6 transition-all duration-300 hover:bg-gray-50">
      <Link href={`/pages/article/detail/${article.id}`} className="block">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 pr-0 sm:pr-4">
            <div className="text-sm text-gray-600 mb-2 flex items-center">
              <span className="font-medium">{article.category}</span>
              <span className="mx-2">•</span>
              <span>{article.days} days ago</span>
            </div>

            <h2 className="text-xl font-bold mb-2 transition-colors duration-300 hover:text-blue-600">
              {article.title}
            </h2>
            <p className="text-gray-700 mb-4">{article.description}</p>

            <div className="flex items-center text-sm text-gray-500">
              <button
                onClick={(e) => handleLike(e, article.id)}
                className={`flex items-center mr-4 transition-colors duration-200 ${
                  isLiked ? "text-blue-500" : ""
                }`}
              >
                <ThumbsUp
                  size={16}
                  className="mr-1 transition-transform duration-200 hover:scale-110"
                />
                <span>{likeCount}</span>
              </button>

              <div className="flex items-center mr-4">
                <MessageSquare size={16} className="mr-1" />
                <span>{article.comments}</span>
              </div>

              {/* <button
                onClick={handleShare}
                className="mr-4 transition-transform duration-200 hover:scale-110"
              >
                <Share2 size={16} />
              </button> */}
              <ShareDropdown id={article.id} />

              <button
                onClick={(e) => handleSave(e, article.id)}
                className={`ml-auto transition-colors duration-200 ${
                  isSaved ? "text-blue-500" : ""
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck
                    size={16}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                ) : (
                  <Bookmark
                    size={16}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="w-full sm:w-1/4 mt-4 sm:mt-0 h-28 sm:h-32 relative bg-gray-100 rounded overflow-hidden transform transition-transform duration-300 hover:scale-105">
            {article.image && (
              <div className="w-full h-full relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
