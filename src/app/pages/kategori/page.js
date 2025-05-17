"use client";
import Head from "next/head";
import { useState } from "react";
import Header from "../../../components/pages/components/Header";
import Footer from "../../../components/pages/components/Footer";

// Category Tag Component
const CategoryTag = ({ text }) => {
  return (
    <button className="px-4 py-1 text-sm rounded-full bg-white shadow-sm mr-2 hover:bg-gray-50 transition-colors">
      {text}
    </button>
  );
};

// Featured Article Component
const FeaturedArticle = () => {
  return (
    <div className="mb-12">
      <div className="w-full h-80 rounded-lg bg-gray-200 mb-6">
        {/* Placeholder for article image */}
      </div>
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white mr-2">
          A
        </div>
        <span className="font-medium">Ananda Ganteng</span>
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center">
        Build an Agentic Workflow for your BigQuery data using LangGraph and
        Gemini
      </h2>
      <p className="text-gray-600 text-center mb-4">
        Build an Agentic Workflow for your BigQuery data using LangGraph and
        Gemini
      </p>
      <div className="flex items-center justify-center space-x-4 text-gray-600">
        <span>3 years</span>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>45</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

// Article Card Component
const ArticleCard = ({
  category,
  title,
  description,
  years,
  likes,
  comments,
}) => {
  return (
    <div className="mb-8">
      <div className="w-full h-56 bg-gray-200 rounded-lg mb-3"></div>
      <div className="mb-1">
        <span className="text-sm text-gray-700">{category}</span>
      </div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <span>{years} years</span>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{likes}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

// Main Category Page Component
const CategoryPage = () => {
  // Sample article data
  const articles = [
    {
      id: 1,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 2,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 3,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 4,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 5,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 6,
      category: "Google Cloud - Community",
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>TemuCerita - Travel</title>
        <meta
          name="description"
          content="Discover travel stories and articles on TemuCerita"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Category Tags */}
        <div className="flex flex-wrap mb-6">
          <CategoryTag text="Short Story" />
          <CategoryTag text="Culture" />
          <CategoryTag text="Short Story" />
        </div>

        {/* Category Title */}
        <h1 className="text-4xl font-bold text-center mb-10">Travel</h1>

        {/* Featured Article */}
        <FeaturedArticle />

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              category={article.category}
              title={article.title}
              description={article.description}
              years={article.years}
              likes={article.likes}
              comments={article.comments}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
