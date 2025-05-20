import { comparePassword } from "@/utils/crypto";
import users from "@/data/users.json";
import { errorResponse, successResponse } from "@/utils/response";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return errorResponse("User not found", 404);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return errorResponse("Invalid password", 401);
  }

  return successResponse(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture: user.profile_picture,
    },
    "Login successful"
  );
}
