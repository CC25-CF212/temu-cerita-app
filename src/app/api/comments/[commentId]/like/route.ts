
export async function POST(
  request: Request,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    // Await the params since they might be a Promise in newer Next.js versions
    const params = await context.params;
    const commentId = params.commentId;

    const body = await request.json();
    const { userId } = body;

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

    
    const newLikesCount = Math.floor(Math.random() * 50) + 1;

    return Response.json({
      success: true,
      likes: newLikesCount,
      isLiked: Math.random() > 0.5,
      commentId, // Include commentId in response for verification
    });
  } catch (error) {
    console.error("Error in comment like handler:", error);
    return Response.json(
      { success: false, error: "Failed to like comment" },
      { status: 500 }
    );
  }
}
