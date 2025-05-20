import { NextResponse } from "next/server";

export function successResponse(
  data: any,
  message = "Success",
  statusCode = 200
) {
  return NextResponse.json(
    {
      statusCode,
      message,
      error: null,
      data,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  message = "Error",
  statusCode = 500,
  error: string | null = null
) {
  return NextResponse.json(
    {
      statusCode,
      message,
      error,
      data: null,
    },
    { status: statusCode }
  );
}
