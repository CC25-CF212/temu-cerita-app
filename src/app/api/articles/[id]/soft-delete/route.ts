import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://your-api-domain.com";
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params adalah Promise
) {
  const params = await context.params; // await dulu params
  const { id } = params; // baru destructuring id

  try {
    console.log("Soft delete request for articleId:", id);

    const res = await fetch(`${BASE_URL}/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Gagal melakukan soft delete ke API pihak ketiga");
    }

    return NextResponse.json(
      { message: "Soft delete berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Soft delete error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
