// pages/api/comments/reply/[replyId]/like.ts
// POST /api/comments/reply/[replyId]/like - Like/unlike a reply
export async function POST(
  request: Request,
  context: { params: { replyId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;
    const replyId = context.params;

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Similar logic as comment likes but for replies
    // const existingLike = await prisma.replyLike.findUnique({
    //   where: {
    //     userId_replyId: {
    //       userId,
    //       replyId
    //     }
    //   }
    // });

    // Mock response for development
    const newLikesCount = Math.floor(Math.random() * 20) + 1;

    return Response.json({
      success: true,
      likes: newLikesCount,
      isLiked: Math.random() > 0.5,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to like reply" },
      { status: 500 }
    );
  }
}
