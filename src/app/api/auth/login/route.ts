import { errorResponse, successResponse } from "@/utils/response";
import { loginUser } from "@/lib/api/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const res = await loginUser({ email, password });
  if (res.statusCode === "200") {
    return successResponse(
      {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        profile_picture: "/images/gambar.png",
        token: res.token,
      },
      "Login successful"
    );
  } else {
    return errorResponse(res.message, res.statusCode);
  }
}
