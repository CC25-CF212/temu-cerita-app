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
        token: res.user.token,
        admin: res.user.admin,
      },
      res.message
    );
  } else {
    return errorResponse(res.message, res.statusCode);
  }
}
