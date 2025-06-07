// File: utils/articles.js
export const fetchArticles = async (category = null) => {
  //  console.log("get data",category)
  // const url = new URL("/api/article", window.location.origin);
  // url.searchParams.set("page", 1);
  // url.searchParams.set("limit", 100);

  // const response = await fetch(url.toString());

  // Kirim request POST dengan JSON body
  const response = await fetch("/api/article/kondisi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category }),
  });


  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // Alternatif: tampilkan dalam format yang lebih masuk akal
  const getTimeAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - createdDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} hari lalu`;
    if (diffInHours > 0) return `${diffInHours} jam lalu`;
    if (diffInMinutes > 0) return `${diffInMinutes} menit lalu`;
    return "Baru saja";
  };
  const hasil = await response.json();
  // Transform data ke format yang diinginkan
  const transformedData = {
    ...hasil,
    articles: hasil.articles.map((article) => ({
      id: article.id,
      category: article.category,
      title: article.title,
      description: article.description,
      author: article.author.name, // Ambil nama dari object author
      authorInitial: article.author.name.charAt(0).toUpperCase(), // Ambil huruf pertama
      years: getTimeAgo(article.createdAt), // Hitung waktu dari createdAt
      likes: article.likes,
      comments: article.comments,
      image: article.image, // Gunakan thumbnail_url sebagai image
      images: article.images, // Gunakan thumbnail_url sebagai imageUrl
    })),
  };
  // if (category && category !== "All") {
  //   return {
  //     ...hasil,
  //     articles: hasil.articles.filter(
  //       (article) => article.category === category
  //     ),
  //   };
  // }

  // return hasil;
  if (category && category !== "All") {
    console.log("filter katgeori");
    return {
      ...transformedData,
      articles: transformedData.articles.filter(
        (article) => article.category === category
      ),
    };
  }
  console.log("filter all");
  return transformedData;
};
export const fetchCategories = async () => {
  // // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would be fetched from an API
  //const data = require("../data/articles.json");
  //console.log("Fetched categories:", data.categories);
  const res = await fetch("/api/kategori");
  const hasil = await res.json();
  const namaKategori = hasil.map((item) => item.nama.replace(/\r$/, ""));
  console.log(namaKategori);
  return namaKategori;
  //return data.categories;
  // const res = await fetch("/api/kategori");
  // if (res.ok) {
  //   const data = await res.json();
  //   console.log("Fetched categories:", data);
  //   return data;
  // } else {
  //   console.error("Failed to fetch categories");
  //   return [];
  // }
};
