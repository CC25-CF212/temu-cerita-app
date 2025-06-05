// app/api/comments/reply/route.ts
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, parentId, articleId, userId,namaUser } = body;

    if (!text || !parentId || !articleId || !userId) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(namaUser)
    const db = await getDatabase();
    const collection = db.collection("comments");

    const newReply = {
      _id: new ObjectId(),
      name: namaUser,
      text,
      time: new Date(),
      likes: 0,
      parentId,
      userId,
      createdAt: new Date(),
    };

    // Add reply to the parent comment's replies array
    const parentObjectId = new ObjectId(parentId);
    const result = await collection.updateOne(
      { _id: parentObjectId },
      {
        $push: { replies: newReply } as any,
        $set: { updatedAt: new Date() },
      }
    );
    console.log("Update operation result:", result);
    // if (result.matchedCount === 0) {
    //   return Response.json(
    //     { success: false, error: "Parent comment not found" },
    //     { status: 404 }
    //   );
    // }

    return Response.json({
      success: true,
      id: newReply._id.toString(),
      name: newReply.name,
      text: newReply.text,
      time: newReply.time,
      likes: newReply.likes,
      parentId,
      userId,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return Response.json(
      { success: false, error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
