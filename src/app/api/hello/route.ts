import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from API route!" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ received: data });
}
