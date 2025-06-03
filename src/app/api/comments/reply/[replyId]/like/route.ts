// // pages/api/comments/reply/[replyId]/like.ts
// // POST /api/comments/reply/[replyId]/like - Like/unlike a reply
// export async function POST(
//   request: Request,
//   context: { params: { replyId: string } }
// ) {
//   try {
//     const body = await request.json();
//     const { userId } = body;
//     const replyId = context.params;

//     if (!userId) {
//       return Response.json(
//         { success: false, error: "User ID required" },
//         { status: 400 }
//       );
//     }

//     // Similar logic as comment likes but for replies
//     // const existingLike = await prisma.replyLike.findUnique({
//     //   where: {
//     //     userId_replyId: {
//     //       userId,
//     //       replyId
//     //     }
//     //   }
//     // });

//     // Mock response for development
//     const newLikesCount = Math.floor(Math.random() * 20) + 1;

//     return Response.json({
//       success: true,
//       likes: newLikesCount,
//       isLiked: Math.random() > 0.5,
//     });
//   } catch (error) {
//     return Response.json(
//       { success: false, error: "Failed to like reply" },
//       { status: 500 }
//     );
//   }
// }
// app/api/comments/reply/[replyId]/like/route.ts
import { NextRequest } from "next/server";

// POST /api/comments/reply/[replyId]/like - Like/unlike a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    // Await the params since they are Promise in Next.js 15
    const { replyId } = await params;

    const body = await request.json();
    const { userId } = body;

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

    // Similar logic as comment likes but for replies
    // const existingLike = await prisma.replyLike.findUnique({
    //   where: {
    //     userId_replyId: {
    //       userId,
    //       replyId: parseInt(replyId)
    //     }
    //   }
    // });

    // let newLikesCount;
    // let isLiked;
    // if (existingLike) {
    //   // Unlike
    //   await prisma.replyLike.delete({
    //     where: { id: existingLike.id }
    //   });
    //   isLiked = false;
    //   newLikesCount = await prisma.replyLike.count({
    //     where: { replyId: parseInt(replyId) }
    //   });
    // } else {
    //   // Like
    //   await prisma.replyLike.create({
    //     data: {
    //       userId,
    //       replyId: parseInt(replyId)
    //     }
    //   });
    //   isLiked = true;
    //   newLikesCount = await prisma.replyLike.count({
    //     where: { replyId: parseInt(replyId) }
    //   });
    // }

    // Mock response for development
    const newLikesCount = Math.floor(Math.random() * 20) + 1;
    const isLiked = Math.random() > 0.5;

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

// GET /api/comments/reply/[replyId]/like - Get like status for a reply
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const { replyId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!replyId) {
      return Response.json(
        { success: false, error: "Reply ID required" },
        { status: 400 }
      );
    }

    // Get like count and user's like status
    // const [likesCount, userLike] = await Promise.all([
    //   prisma.replyLike.count({
    //     where: { replyId: parseInt(replyId) }
    //   }),
    //   userId ? prisma.replyLike.findUnique({
    //     where: {
    //       userId_replyId: {
    //         userId,
    //         replyId: parseInt(replyId)
    //       }
    //     }
    //   }) : null
    // ]);

    // Mock response for development
    const likesCount = Math.floor(Math.random() * 20) + 1;
    const isLiked = userId ? Math.random() > 0.5 : false;

    return Response.json({
      success: true,
      likes: likesCount,
      isLiked,
      replyId,
    });
  } catch (error) {
    console.error("Error getting reply like status:", error);
    return Response.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    );
  }
}
