import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
async function webRequestToNodeReadable(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Request has no body");

  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(Buffer.from(value));
    },
  });

  // Berikan header agar formidable bisa parsing dengan benar
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return Object.assign(stream, {
    headers,
    method: request.method ?? "POST",
    url: "",
  });
}

export const config = {
  api: {
    bodyParser: false, // matikan parsing body bawaan Next.js untuk formidable
  },
};

export async function POST(request) {
  const nodeReq = await webRequestToNodeReadable(request);

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
  const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
  const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
  const activeStr = Array.isArray(fields.active)
    ? fields.active[0]
    : fields.active;
  const adminStr = Array.isArray(fields.admin) ? fields.admin[0] : fields.admin;
  const createdAt = Array.isArray(fields.createdAt)
    ? fields.createdAt[0]
    : fields.createdAt;

  const active = activeStr === "true";
  const admin = adminStr === "true";

  let profile_picture = "";

  const fileArray = Array.isArray(files.profile_picture)
    ? files.profile_picture
    : [files.profile_picture];

  for (const file of fileArray) {
    if (file && file.filepath) {
      console.log("Uploading file to Cloudinary:", file.filepath);
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "profiles",
      });
      profile_picture = result.secure_url;
    }
  }

  const updatedProfile = {
    name,
    email,
    ...(profile_picture ? { profile_picture } : {}),
  };

  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProfile),
  });

  const hasil = await response.json();
  console.log("Response from userService:", hasil);
  return NextResponse.json(updatedProfile);
}
