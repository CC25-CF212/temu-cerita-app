// pages/api/comments/reply.ts
// POST /api/comments/reply - Create a reply to a comment
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

    // Insert reply into database
    // const newReply = await prisma.reply.create({
    //   data: {
    //     text,
    //     parentId,
    //     articleId,
    //     userId,
    //     createdAt: new Date()
    //   },
    //   include: {
    //     user: {
    //       select: { id: true, name: true, avatar: true }
    //     }
    //   }
    // });

    // Mock response for development
    const newReply = {
      id: Date.now(),
      name: "You", // Get from user session/auth
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
