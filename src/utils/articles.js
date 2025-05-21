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

  return data;
};
export const fetchCategories = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, this would be fetched from an API
  const data = require("../data/articles.json");
  return data.categories;
};
