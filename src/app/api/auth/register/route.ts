import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "@/utils/crypto";
import users from "@/data/users.json";
import fs from "fs";
import path from "path";
import { errorResponse, successResponse } from "@/utils/response";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return errorResponse("Email already registered", 400);
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    profile_picture: "/images/gambar.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
    admin: false,
  };

  const updatedUsers = [...users, newUser];
  const filePath = path.join(process.cwd(), "src/data/users.json");
  fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2));

  return successResponse(newUser, "User registered successfully", 201);
}
