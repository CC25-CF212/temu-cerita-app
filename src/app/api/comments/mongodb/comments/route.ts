// app/api/comments/route.ts
import { getDatabase } from "@/lib/mongodb/mongodb";
import { NextRequest } from "next/server";
// atau jika menggunakan Mongoose:
// import connectToDatabase from "@/lib/mongoose";
// import Comment from "@/models/Comment";

// POST - Create new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, articleId, userId,namaUser } = body;

    
    if (!text || !articleId || !userId) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(namaUser)
    // Menggunakan MongoDB Native Driver
    const db = await getDatabase();
    const collection = db.collection('comments');

    const newComment = {
      name:namaUser, // Get from user session/auth
      text,
      time: new Date(),
      likes: 0,
      replies: [],
      articleId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newComment);

    return Response.json({
      success: true,
      id: result.insertedId,
      ...newComment,
    });

    // Atau jika menggunakan Mongoose:
    /*
    await connectToDatabase();
    
    const newComment = new Comment({
      name: "You",
      text,
      articleId,
      userId,
    });

    const savedComment = await newComment.save();

    return Response.json({
      success: true,
      ...savedComment.toObject(),
    });
    */

  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// GET - Fetch comments by articleId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return Response.json(
        { success: false, error: "Article ID required" },
        { status: 400 }
      );
    }

    // Menggunakan MongoDB Native Driver
    const db = await getDatabase();
    const collection = db.collection('comments');

    const comments = await collection
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      comments,
      total: comments.length,
    });

    // Atau jika menggunakan Mongoose:
    /*
    await connectToDatabase();
    
    const comments = await Comment
      .find({ articleId })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      comments,
      total: comments.length,
    });
    */

  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}