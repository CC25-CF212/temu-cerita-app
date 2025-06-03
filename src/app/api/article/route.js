// app/api/articles/route.js
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Konversi Web Request ke Node.js stream
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
    method: request.method ?? "POST",
    url: "",
  });
}

export async function POST(request) {
  try {
    const nodeReq = await webRequestToNodeReadable(request);
    const form = new IncomingForm({ multiples: true, keepExtensions: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    // const content = Array.isArray(fields.content)
    //   ? fields.content[0]
    //   : fields.content;
    // const artikelId = Array.isArray(fields.artikelId)
    //   ? fields.artikelId[0]
    //   : fields.artikelId;

    // Pastikan semua field adalah string (karena formidable bisa jadi array)
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const content_html = Array.isArray(fields.content_html)
      ? fields.content_html[0]
      : fields.content_html;
    const province = Array.isArray(fields.province)
      ? fields.province[0]
      : fields.province;
    const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
    const active = Array.isArray(fields.active)
      ? fields.active[0]
      : fields.active;
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;

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
    const payload = {
      title,
      content_html,
      province,
      city,
      active,
      category,
      images: imageUrls,
    };
    console.log("Payload:", payload);
    console.log("Image URLs:", imageUrls);
    // call api
    return NextResponse.json({
      message: "Upload sukses",
      data: {
        title,
        content_html,
        province,
        city,
        active,
        category,
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error("Upload gagal:", error);
    return NextResponse.json(
      { message: "Gagal upload ke Cloudinary", error: `${error}` },
      { status: 500 }
    );
  }
}
// GET Method - Mengambil semua artikel
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = parseInt(searchParams.get("offset")) || 0;

    console.log("GET /api/article - category:", category);
    // TODO: Ganti dengan database query sebenarnya
    // Contoh menggunakan Prisma atau database lainnya
    /*
    const articles = await db.article.findMany({
      where: category ? { category } : undefined,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });
    */

    // Mock data untuk sementara - ganti dengan query database
    const mockArticles = [
      {
        id: 1,
        category: "For You",
        title: "When did your data REALLY arrive in BigQuery?",
        description:
          "A short guide on capturing data ingestion time in BigQuery",
        content_html: "<p>Content here...</p>",
        province: "DKI Jakarta",
        city: "Jakarta",
        active: true,
        image: "/images/gambar.png",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 45,
        comments: 5,
      },
      {
        id: 2,
        category: "Technology",
        title: "Building Scalable Microservices",
        description: "Learn how to build and deploy microservices at scale",
        content_html: "<p>Microservices content...</p>",
        province: "Jawa Barat",
        city: "Bandung",
        active: true,
        image: "/images/gambar.png",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 32,
        comments: 8,
      },
      {
        id: 3,
        category: "Google Cloud - Community",
        title: "Optimizing Cloud Storage Costs",
        description: "Tips and tricks to reduce your cloud storage expenses",
        content_html: "<p>Cost optimization content...</p>",
        province: "Jawa Timur",
        city: "Surabaya",
        active: true,
        image: "/images/gambar.png",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 28,
        comments: 12,
      },
    ];

    // Filter berdasarkan category jika ada
    let filteredArticles = mockArticles;
    if (category) {
      filteredArticles = mockArticles.filter((article) =>
        article.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Apply pagination
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    // Format data sesuai dengan struktur yang diinginkan
    const formattedArticles = paginatedArticles.map((article) => ({
      id: article.id,
      category: article.category,
      title: article.title,
      description: article.description,
      days: Math.floor(
        (new Date() - new Date(article.createdAt)) / (1000 * 60 * 60 * 24)
      ),
      likes: article.likes || 0,
      comments: article.comments || 0,
      image: article.image || "/images/default.png",
      province: article.province,
      city: article.city,
      active: article.active,
    }));

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      totalCount: filteredArticles.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < filteredArticles.length,
      },
      ...(category && { category }),
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
