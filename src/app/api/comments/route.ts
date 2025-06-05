
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, articleId, userId } = body;

    if (!text || !articleId || !userId) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newComment = {
      id: Date.now(),
      name: "You", // Get from user session/auth
      text,
      time: "just now",
      likes: 0,
      replies: [],
      articleId,
      userId,
    };

    return Response.json({
      success: true,
      ...newComment,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
