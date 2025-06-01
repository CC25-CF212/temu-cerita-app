import { BASE_URL } from "./config";

export async function registerUser(data: any) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function loginUser(data: any) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
