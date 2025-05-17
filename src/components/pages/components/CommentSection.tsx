import { useState } from "react";
import CommentItem from "./CommentItem";

interface Reply {
  id: number;
  name: string;
  text: string;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  time: string;
  likes: number;
  replies: Reply[];
}

export default function CommentSection() {
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Alice",
      text: "Nice post!",
      time: "2h ago",
      likes: 3,
      replies: [],
    },
  ]);

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      name: "You",
      text: commentText,
      time: "just now",
      likes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleReplySubmit = (commentId: number, replyText: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                name: "You",
                text: replyText,
              },
            ],
          }
        : comment
    );
    setComments(updatedComments);
  };

  const handleLike = (commentId: number) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    );
    setComments(updatedComments);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Comment input */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="What are your thoughts?"
            className="w-full px-4 py-2 bg-gray-100 rounded-lg"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommentSubmit();
            }}
          />
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplySubmit={handleReplySubmit}
            onLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
}
