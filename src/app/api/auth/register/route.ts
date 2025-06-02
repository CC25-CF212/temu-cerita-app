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
  if (res.statusCode === "201" || res.statusCode === "200") {
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
