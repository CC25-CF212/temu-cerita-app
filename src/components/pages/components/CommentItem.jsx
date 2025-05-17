import { useState } from "react";
import { Heart } from "lucide-react";

export default function CommentItem({ comment, onReplySubmit, onLike }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (replyText.trim() !== "") {
      onReplySubmit(comment.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <h4 className="font-medium mr-2">{comment.name}</h4>
          <span className="text-sm text-gray-500">{comment.time}</span>
        </div>
        <p className="mb-2">{comment.text}</p>
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center space-x-1"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm">{comment.likes}</span>
          </button>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-sm text-gray-500"
          >
            Reply
          </button>
        </div>

        {showReplyBox && (
          <div className="ml-4 mt-2">
            <input
              type="text"
              className="w-full px-3 py-1 bg-gray-100 rounded"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
            />
          </div>
        )}

        {/* Render replies if exist */}
        {comment.replies?.map((reply) => (
          <div key={reply.id} className="ml-4 mt-4 flex items-start space-x-2">
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            <div>
              <div className="text-sm font-medium">{reply.name}</div>
              <p className="text-sm">{reply.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
