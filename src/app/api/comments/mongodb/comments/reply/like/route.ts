// app/api/comments/reply/[replyId]/like/route.ts
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb/mongodb";

// POST /api/comments/reply/[replyId]/like - Like/unlike a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const body = await request.json();
    const { userId, replyId } = body;

    // Validate required fields
    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    if (!replyId) {
      return Response.json(
        { success: false, error: "Reply ID required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(replyId)) {
      return Response.json(
        { success: false, error: "Invalid reply ID format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await getDatabase();
    const replyLikesCollection = db.collection("reply_likes");

    // Check if user already liked this reply
    const existingLike = await replyLikesCollection.findOne({
      userId: userId,
      replyId: new ObjectId(replyId)
    });

    let newLikesCount: number;
    let isLiked: boolean;

    if (existingLike) {
      // Unlike - remove the like
      await replyLikesCollection.deleteOne({
        _id: existingLike._id
      });
      
      isLiked = false;
      
      // Count remaining likes for this reply
      newLikesCount = await replyLikesCollection.countDocuments({
        replyId: new ObjectId(replyId)
      });
    } else {
      // Like - create new like
      await replyLikesCollection.insertOne({
        userId: userId,
        replyId: new ObjectId(replyId),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      isLiked = true;
      
      // Count total likes for this reply
      newLikesCount = await replyLikesCollection.countDocuments({
        replyId: new ObjectId(replyId)
      });
    }

    return Response.json({
      success: true,
      likes: newLikesCount,
      isLiked,
      replyId,
    });

  } catch (error) {
    console.error("Error in reply like handler:", error);
    return Response.json(
      { success: false, error: "Failed to like reply" },
      { status: 500 }
    );
  }
}