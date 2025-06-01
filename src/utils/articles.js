// File: utils/articles.js
export const fetchArticles = async (category = null) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, this would be fetched from an API
  const data = require("../data/articles.json");

  if (category && category !== "All") {
    return {
      ...data,
      articles: data.articles.filter(
        (article) => article.category === category
      ),
    };
  }
  console.log("Fetched articles:", data);
  return data;
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
