import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ar, id as tset } from "date-fns/locale";
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

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (commentId: number, replyText: string) => void;
  onLike: (commentId: number, isReply?: boolean) => void;
  currentUserId?: string; // Changed from number to string
  depth?: number;
}

export default function CommentItem({
  comment,
  onReplySubmit,
  onLike,
  currentUserId,
  depth = 0,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [showAllReplies, setShowAllReplies] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const maxDepth = 3; // Maximum nesting level
  const repliesToShow = showAllReplies
    ? comment.replies.length
    : Math.min(3, comment.replies.length);
  const hasMoreReplies = comment.replies.length > 3 && !showAllReplies;

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    onReplySubmit(comment._id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  const handleLike = () => {
    onLike(comment._id, false);
    setIsLiked(!isLiked);
  };

  const handleReplyLike = (replyId: number) => {
    onLike(replyId, true);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const marginLeft = depth > 0 ? `ml-${Math.min(depth * 8, 32)}` : "";

  return (
    <div
      className={`${marginLeft} ${
        depth > 0 ? "border-l-2 border-gray-100 pl-4" : ""
      }`}
    >
      {/* Main comment */}
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-full ${getAvatarColor(
            comment.name
          )} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}
        >
          {getInitials(comment.name)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {comment.name}
            </span>
            <span className="text-gray-500 text-xs">{comment?.time
                                  ? formatDistanceToNow(new Date(comment.time), {
                                      addSuffix: true,
                                      locale: tset,
                                    })
                                  : "Unknown time"}</span>
            {comment.userId === currentUserId && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>

          {/* Comment text */}
          <p className="text-gray-800 text-sm mb-2 break-words">
            {comment.text}
          </p>

          {/* Comment actions */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{comment.likes}</span>
            </button>

            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="hover:text-blue-500 transition-colors"
              >
                Reply
              </button>
            )}

            {/* <button className="hover:text-gray-700 transition-colors">
              Share
            </button> */}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-3 flex items-start space-x-2">
              <div
                className={`h-6 w-6 rounded-full ${getAvatarColor(
                  "You"
                )} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}
              >
                {currentUserId ? "U" : "?"}
              </div>
              <div className="flex-1">
                <textarea
                  placeholder={`Reply to ${comment.name}...`}
                  className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyText("");
                    }}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.slice(0, repliesToShow).map((reply) => (
            <div key={`reply-${reply.id}-${reply.text}`} className="flex items-start space-x-3 ml-6">
              <div
                className={`h-6 w-6 rounded-full ${getAvatarColor(
                  reply.name
                )} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}
              >
                {getInitials(reply.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">
                    {reply.name}
                  </span>
                  <span className="text-gray-500 text-xs">{reply.time}</span>
                  {reply.userId === currentUserId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>

                <p className="text-gray-800 text-sm mb-2 break-words">
                  {reply.text}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {/* <button
                    onClick={() => handleReplyLike(reply.id)}
                    className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{reply.likes}</span>
                  </button> */}

                  {depth < maxDepth - 1 && (
                    <button
                      onClick={() => setShowReplyInput(!showReplyInput)}
                      className="hover:text-blue-500 transition-colors"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Show more replies button */}
          {hasMoreReplies && (
            <button
              onClick={() => setShowAllReplies(true)}
              className="ml-6 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Show {comment.replies.length - 3} more replies
            </button>
          )}

          {/* Show less replies button */}
          {showAllReplies && comment.replies.length > 3 && (
            <button
              onClick={() => setShowAllReplies(false)}
              className="ml-6 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Show less replies
            </button>
          )}
        </div>
      )}
    </div>
  );
}