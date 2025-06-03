import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET handler
export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;
  const page = 1;
  const limit = 10;

  try {
    const response = await fetch(
      `${BASE_URL}/articles/${id}?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      return new NextResponse("Failed to fetch article", {
        status: response.status,
      });
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Fetch article error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// Konversi web request ke Node.js stream
async function webRequestToNodeReadable(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("No body in request");

  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });

  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return Object.assign(stream, {
    headers,
    method: request.method || "POST",
    url: "",
  });
}

// POST handler
export async function POST(request, context) {
  try {
    const nodeReq = await webRequestToNodeReadable(request);
    const form = new IncomingForm({ multiples: true, keepExtensions: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const getField = (field) => (Array.isArray(field) ? field[0] : field);

    const title = getField(fields.title);
    const content_html = getField(fields.content_html);
    const province = getField(fields.province);
    const city = getField(fields.city);
    const active = getField(fields.active);
    const category = getField(fields.category);

    const fileArray = Array.isArray(files.images)
      ? files.images
      : [files.images];

    const uploadResults = await Promise.all(
      fileArray.map((file) =>
        cloudinary.uploader.upload(file.filepath, {
          folder: `artikels/${category}`,
        })
      )
    );

    const imageUrls = uploadResults.map((r) => r.secure_url);
    const images = imageUrls.map((url, index) => ({
      image_url: url,
      alt_text: `Gambar ${index + 1}`, // Bisa diganti dari form kalau tersedia
      caption: `Caption gambar ${index + 1}`, // Sama, bisa disesuaikan
      order: index + 1,
    }));

    const payload = {
      title,
      content_html,
      //province,
      //city,
      //active,
      categories: [category],
      images: images,
    };
    console.log("Payload to update:", JSON.stringify(payload));
    const params = await context.params;
    const { id } = params;
    const updateUrl = `${BASE_URL}/articles/${id}`;

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const hasilUpdate = await updateResponse.json();
    return NextResponse.json({
      message: hasilUpdate.message,
      data: hasilUpdate.data,
    });
  } catch (error) {
    console.error("Upload gagal:", error);
    return NextResponse.json(
      { message: "Gagal upload ke Cloudinary", error: `${error}` },
      { status: 500 }
    );
  }
}
