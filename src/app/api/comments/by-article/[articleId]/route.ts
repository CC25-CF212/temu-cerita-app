// pages/api/comments/[articleId].ts atau app/api/comments/[articleId]/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

// GET /api/comments/[articleId] - Fetch comments for an article
export async function GET(
  req: NextRequest,
  context: { params: { articleId: string } }
) {
  try {
    const { articleId } = await context.params; // ✅ wajib pakai await

    // Query your database here
    // Example using Prisma:
    // const comments = await prisma.comment.findMany({
    //   where: { articleId: parseInt(articleId) },
    //   include: {
    //     replies: {
    //       orderBy: { createdAt: 'asc' }
    //     },
    //     user: {
    //       select: { id: true, name: true, avatar: true }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Mock data for development
    const comments = [
      {
        id: 1,
        name: "Alice Johnson",
        text: "This is a great article! Really helpful insights about LangGraph.",
        time: "2h ago",
        likes: 8,
        userId: 101,
        articleId: parseInt(articleId),
        replies: [
          {
            id: 101,
            name: "Bob Smith",
            text: "I agree! The BigQuery integration part was especially useful.",
            time: "1h ago",
            likes: 3,
            parentId: 1,
            userId: 102,
          },
        ],
      },
    ];

    return Response.json({
      success: true,
      comments,
      total: comments.length,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
