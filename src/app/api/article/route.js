// app/api/articles/route.js
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import { BASE_URL } from "@/lib/api/config";

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
    const userId = Array.isArray(fields.user_id)
      ? fields.user_id[0]
      : fields.user_id;
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
      userId,
      title,
      content_html,
      province,
      city,
      active,
      category,
      images: imageUrls,
    };

    const saveurl = `${BASE_URL}/articles`;

    const updateResponse = await fetch(saveurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const hasilUpdate = await updateResponse.json();
    // call api
    return NextResponse.json({
      message: hasilUpdate.message || "Artikel berhasil diupload",
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

    let apiUrl = `${BASE_URL}/articles?page=1&limit=${limit}`;
    if (category) {
      apiUrl += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("API apiUrl:", apiUrl);
    const articles = Array.isArray(data.data?.articles)
      ? data.data.articles
      : [];

    // Tidak perlu filter manual lagi karena category sudah difilter di API
    // Tapi jika ingin filter tambahan di client:
    // let filteredArticles = articles;
    // if (category) {
    //   filteredArticles = articles.filter((article) =>
    //     article.category.toLowerCase().includes(category.toLowerCase())
    //   );
    // }

    // let filteredArticles = mockArticles;
    // if (category) {
    //   filteredArticles = mockArticles.filter((article) =>
    //     article.category.toLowerCase().includes(category.toLowerCase())
    //   );
    // }

    // Apply pagination
    //const paginatedArticles = filteredArticles.slice(offset, offset + limit);
    const paginatedArticles = articles.slice(offset, offset + limit);

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
      image: article.images[0] || "/images/default.png",
      images: article.images || [],
      province: article.province,
      city: article.city,
      active: article.active,
      author: {
        id: article.author?.id || "default-author-id",
        name: article.author?.name || "Unknown Author",
        email: article.author?.email || "unknown@example.com",
      },
    }));

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      totalCount: articles.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < articles.length,
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
