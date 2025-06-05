
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, parentId, articleId, userId } = body;

    if (!text || !parentId || !articleId || !userId) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReply = {
      id: Date.now(),
      name: "You",
      text,
      time: "just now",
      likes: 0,
      parentId,
      userId,
    };

    return Response.json({
      success: true,
      ...newReply,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
