import { errorResponse, successResponse } from "@/utils/response";
import { registerUser } from "@/lib/api/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, google_id, image } = body;

  const newUser = {
    name,
    email,
    password,
    google_id,
    image,
  };
  const res = await registerUser(newUser);
  if (res.statusCode === "201") {
    return successResponse(
      {
        statusCode: res.statusCode,
        status: res.status,
      },
      "User registered successfully"
    );
  } else {
    return errorResponse(res.message, res.statusCode);
  }
}
