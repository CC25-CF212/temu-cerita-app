"use client";

import { Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";

type InteractionBarProps = {
  initialLikes: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
  commentsCount: number;
};

const InteractionBar: React.FC<InteractionBarProps> = ({
  initialLikes,
  initialIsLiked = false,
  initialIsBookmarked = false,
  commentsCount,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center justify-between border-t border-b py-4 mb-8">
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2" onClick={handleLike}>
          <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </button>
      </div>
      <div>
        <button
          className={`px-4 py-2 rounded-full border ${
            isBookmarked ? "bg-black text-white" : "text-black"
          }`}
          onClick={handleBookmark}
        >
          {isBookmarked ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default InteractionBar;
