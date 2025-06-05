// app/api/comments/[commentId]/like/route.ts
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb/mongodb";

export async function POST(
  request: Request,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
   
    
    const body = await request.json();
    const { userId,commentId } = body;

    console.log("Received body:", body);
    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    if (!commentId) {
      return Response.json(
        { success: false, error: "Comment ID required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const commentsCollection = db.collection('comments');
    const likesCollection = db.collection('comment_likes');

    // Check if user already liked this comment
    const existingLike = await likesCollection.findOne({
      commentId: new ObjectId(commentId),
      userId: userId
    });

    let isLiked: boolean;
    let newLikesCount: number;

    if (existingLike) {
      // Unlike - remove like
      await likesCollection.deleteOne({
        commentId: new ObjectId(commentId),
        userId: userId
      });
      
      // Decrease like count
      await commentsCollection.updateOne(
        { _id: new ObjectId(commentId) },
        { $inc: { likes: -1 } }
      );
      
      isLiked = false;
    } else {
      // Like - add like
      await likesCollection.insertOne({
        commentId: new ObjectId(commentId),
        userId: userId,
        createdAt: new Date()
      });
      
      // Increase like count
      await commentsCollection.updateOne(
        { _id: new ObjectId(commentId) },
        { $inc: { likes: 1 } }
      );
      
      isLiked = true;
    }

    // Get updated like count
    const updatedComment = await commentsCollection.findOne(
      { _id: new ObjectId(commentId) }
    );
    
    newLikesCount = updatedComment?.likes || 0;

    return Response.json({
      success: true,
      likes: newLikesCount,
      isLiked,
      commentId,
    });

  } catch (error) {
    console.error("Error in comment like handler:", error);
    return Response.json(
      { success: false, error: "Failed to like comment" },
      { status: 500 }
    );
  }
}

// GET - Check if user liked the comment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const params = await context.params;
    const commentId = params.commentId;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!commentId) {
      return Response.json(
        { success: false, error: "Comment ID required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const commentsCollection = db.collection('comments');
    const likesCollection = db.collection('comment_likes');

    // Get comment and like status
    const [comment, userLike] = await Promise.all([
      commentsCollection.findOne({ _id: new ObjectId(commentId) }),
      userId ? likesCollection.findOne({
        commentId: new ObjectId(commentId),
        userId: userId
      }) : null
    ]);

    if (!comment) {
      return Response.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      likes: comment.likes || 0,
      isLiked: !!userLike,
      commentId,
    });

  } catch (error) {
    console.error("Error getting comment like status:", error);
    return Response.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    );
  }
}