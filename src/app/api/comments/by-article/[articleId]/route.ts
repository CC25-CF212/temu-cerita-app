// // pages/api/comments/[articleId].ts atau app/api/comments/[articleId]/route.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextRequest } from "next/server";

// // GET /api/comments/[articleId] - Fetch comments for an article
// export async function GET(
//   req: NextRequest,
//   context: { params: { articleId: string } }
// ) {
//   try {
//     const { articleId } = await context.params; // ✅ wajib pakai await

//     // Query your database here
//     // Example using Prisma:
//     // const comments = await prisma.comment.findMany({
//     //   where: { articleId: parseInt(articleId) },
//     //   include: {
//     //     replies: {
//     //       orderBy: { createdAt: 'asc' }
//     //     },
//     //     user: {
//     //       select: { id: true, name: true, avatar: true }
//     //     }
//     //   },
//     //   orderBy: { createdAt: 'desc' }
//     // });

//     // Mock data for development
//     const comments = [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         text: "This is a great article! Really helpful insights about LangGraph.",
//         time: "2h ago",
//         likes: 8,
//         userId: 101,
//         articleId: parseInt(articleId),
//         replies: [
//           {
//             id: 101,
//             name: "Bob Smith",
//             text: "I agree! The BigQuery integration part was especially useful.",
//             time: "1h ago",
//             likes: 3,
//             parentId: 1,
//             userId: 102,
//           },
//         ],
//       },
//     ];

//     return Response.json({
//       success: true,
//       comments,
//       total: comments.length,
//     });
//   } catch (error) {
//     return Response.json(
//       { success: false, error: "Failed to fetch comments" },
//       { status: 500 }
//     );
//   }
// }
// app/api/comments/[commentId]/like/route.ts
import { NextRequest } from "next/server";

// POST /api/comments/[commentId]/like - Like/unlike a comment
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    // Await the params since they are Promise in Next.js 15
    const { commentId } = await context.params;

    const body = await request.json();
    const { userId } = body;

    // Validate required fields
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

    // Check if user already liked this comment
    // const existingLike = await prisma.commentLike.findUnique({
    //   where: {
    //     userId_commentId: {
    //       userId,
    //       commentId: parseInt(commentId)
    //     }
    //   }
    // });

    // let newLikesCount;
    // let isLiked;
    // if (existingLike) {
    //   // Unlike
    //   await prisma.commentLike.delete({
    //     where: { id: existingLike.id }
    //   });
    //   isLiked = false;
    //   newLikesCount = await prisma.commentLike.count({
    //     where: { commentId: parseInt(commentId) }
    //   });
    // } else {
    //   // Like
    //   await prisma.commentLike.create({
    //     data: {
    //       userId,
    //       commentId: parseInt(commentId)
    //     }
    //   });
    //   isLiked = true;
    //   newLikesCount = await prisma.commentLike.count({
    //     where: { commentId: parseInt(commentId) }
    //   });
    // }

    // Mock response for development
    const newLikesCount = Math.floor(Math.random() * 50) + 1;
    const isLiked = Math.random() > 0.5;

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

// GET /api/comments/[commentId]/like - Get like status for a comment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!commentId) {
      return Response.json(
        { success: false, error: "Comment ID required" },
        { status: 400 }
      );
    }

    // Get like count and user's like status
    // const [likesCount, userLike] = await Promise.all([
    //   prisma.commentLike.count({
    //     where: { commentId: parseInt(commentId) }
    //   }),
    //   userId ? prisma.commentLike.findUnique({
    //     where: {
    //       userId_commentId: {
    //         userId,
    //         commentId: parseInt(commentId)
    //       }
    //     }
    //   }) : null
    // ]);

    // Mock response for development
    const likesCount = Math.floor(Math.random() * 50) + 1;
    const isLiked = userId ? Math.random() > 0.5 : false;

    return Response.json({
      success: true,
      likes: likesCount,
      isLiked,
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
