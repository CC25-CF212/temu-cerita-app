// pages/api/comments/[commentId]/like.ts
// POST /api/comments/[commentId]/like - Like/unlike a comment
export async function POST(
  request: Request,
  context: { params: { articleId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;
    const commentId = context.params;

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Check if user already liked this comment
    // const existingLike = await prisma.commentLike.findUnique({
    //   where: {
    //     userId_commentId: {
    //       userId,
    //       commentId
    //     }
    //   }
    // });

    // let newLikesCount;
    // if (existingLike) {
    //   // Unlike
    //   await prisma.commentLike.delete({
    //     where: { id: existingLike.id }
    //   });
    //   newLikesCount = await prisma.commentLike.count({
    //     where: { commentId }
    //   });
    // } else {
    //   // Like
    //   await prisma.commentLike.create({
    //     data: { userId, commentId }
    //   });
    //   newLikesCount = await prisma.commentLike.count({
    //     where: { commentId }
    //   });
    // }

    // Mock response for development
    const newLikesCount = Math.floor(Math.random() * 50) + 1;

    return Response.json({
      success: true,
      likes: newLikesCount,
      isLiked: Math.random() > 0.5,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to like comment" },
      { status: 500 }
    );
  }
}
