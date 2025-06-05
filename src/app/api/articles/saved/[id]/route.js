import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET handler
export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;
  try {
    const response = await fetch(`${BASE_URL}/articles/saved/${id}`);

    if (!response.ok) {
      return new NextResponse("Failed to fetch article", {
        status: response.status,
      });
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Fetch article error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
// POST handler
export async function POST(req, context) {
  const params = await context.params;
  const { id } = params; // articleId

  try {
    const body = await req.json();
    const { userId } = body;

    const response = await fetch(`${BASE_URL}/articles/${id}/${userId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new NextResponse("Gagal menyimpan artikel", {
        status: response.status,
      });
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Save article error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyimpan artikel" },
      { status: 500 }
    );
  }
}
