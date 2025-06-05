import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";

interface Reply {
  id: number;
  name: string;
  text: string;
  time: string;
  likes: number;
  userId?: string; // Changed from number to string
  parentId: number;
}

interface Comment {
  _id: number;
  name: string;
  text: string;
  time: string;
  likes: number;
  replies: Reply[];
  userId?: string; // Changed from number to string
  articleId: string; // Changed from number to string
}

interface CommentSectionProps {
  articleId: string; // Changed from number to string
  currentUserId?: string; // Changed from number to string
  apiEndpoint?: string;
  namaUser?: string;
}

export default function CommentSection({
  articleId,
  currentUserId,
  namaUser,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [commentsToShow, setCommentsToShow] = useState<number>(5);
  const [totalComments, setTotalComments] = useState<number>(0);

  // Load comments from API
  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/comments/mongodb/comments?articleId=${articleId}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setTotalComments(data.total || data.comments?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Fallback to mock data for development
      setComments([
        {
          _id: 1,
          name: "Alice Johnson",
          text: "This is a great article! Really helpful insights about LangGraph.",
          time: "2h ago",
          likes: 8,
          replies: [
            {
              id: 101,
              name: "Bob Smith",
              text: "I agree! The BigQuery integration part was especially useful.",
              time: "1h ago",
              likes: 3,
              parentId: 1,
            },
          ],
          articleId: articleId,
        },
        {
          _id: 2,
          name: "Charlie Davis",
          text: "I've been working with LangGraph for a few months now, and this workflow approach is exactly what I needed. Thanks for sharing!",
          time: "4h ago",
          likes: 12,
          replies: [],
          articleId: articleId,
        },
      ]);
      setTotalComments(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submitting) return;

    try {
      setSubmitting(true);

      const newComment = {
        text: commentText,
        articleId: articleId,
        userId: currentUserId,
        namaUser: namaUser,
      };

      const response = await fetch("/api/comments/mongodb/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments([createdComment, ...comments]);
        setTotalComments((prev) => prev + 1);
      } else {
        // Fallback for development - create local comment
        const mockComment: Comment = {
          _id: Date.now(),
          name: "You",
          text: commentText,
          time: "just now",
          likes: 0,
          replies: [],
          articleId: articleId,
          userId: currentUserId,
        };
        setComments([mockComment, ...comments]);
        setTotalComments((prev) => prev + 1);
      }

      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: number, replyText: string) => {
    if (!replyText.trim()) return;

    try {
      const newReply = {
        text: replyText,
        parentId: commentId,
        articleId: articleId,
        userId: currentUserId,
        namaUser: namaUser,
      };

      const response = await fetch("/api/comments/mongodb/comments/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReply),
      });

      if (response.ok) {
        const createdReply = await response.json();
        const updatedComments = comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, createdReply],
              }
            : comment
        );
        setComments(updatedComments);
      } else {
        // Fallback for development
        const mockReply: Reply = {
          id: Date.now(),
          name: "You",
          text: replyText,
          time: "just now",
          likes: 0,
          parentId: commentId,
        };

        const updatedComments = comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, mockReply],
              }
            : comment
        );
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleLike = async (commentId: number, isReply: boolean = false) => {
    try {
      const endpoint = "/api/comments/mongodb/comments/like";
      const body = {
        userId: currentUserId,
        commentId: commentId,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();

        if (isReply) {
          // Update reply likes
          const updatedComments = comments.map((comment) => ({
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, likes: result.likes } : reply
            ),
          }));
          setComments(updatedComments);
        } else {
          // Update comment likes
          const updatedComments = comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: result.likes }
              : comment
          );
          setComments(updatedComments);
        }
      } else {
        // Fallback for development
        if (isReply) {
          const updatedComments = comments.map((comment) => ({
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            ),
          }));
          setComments(updatedComments);
        } else {
          const updatedComments = comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          );
          setComments(updatedComments);
        }
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLoadMore = () => {
    setCommentsToShow((prev) => prev + 5);
    if (commentsToShow + 5 >= totalComments) {
      setShowMore(false);
    }
  };

  const visibleComments = comments.slice(0, commentsToShow);
  const hasMoreComments = totalComments > commentsToShow;

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Loading comments...</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Comments ({totalComments})</h3>

      {/* Comment input */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          {currentUserId ? "U" : "?"}
        </div>
        <div className="flex-1">
          <textarea
            placeholder="What are your thoughts?"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {commentText.length}/500 characters
            </span>
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onReplySubmit={handleReplySubmit}
                onLike={handleLike}
                currentUserId={currentUserId}
              />
            ))}
          </div>

          {/* Load more button */}
          {hasMoreComments && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Load More Comments ({totalComments - commentsToShow} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
