"use client";
import { useEffect, useState } from "react";
import Header from "../../../../../components/pages/components/layout/Header";
import Footer from "../../../../../components/pages/components/layout/Footer";
import SidebarArticle from "@/components/pages/components/SidebarArticle";
import CommentSection from "@/components/pages/components/CommentSection";
import InteractiveGallery from "@/components/pages/components/InteractiveGallery";
import { galleryItems } from "@/data/galleryItems";
export default function ArticleDetail() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(25);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Comment data
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Syntia",
      time: "3 day",
      text: "looks a lot like VS Code ... oh, that's indeed VS Code 😉",
      likes: 45,
      replies: 5,
    },
    {
      id: 2,
      name: "Budi Pratama",
      time: "2 day",
      text: "Great article! I've been looking for ways to integrate LangGraph with BigQuery. This is exactly what I needed.",
      likes: 23,
      replies: 2,
    },
  ]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([
        {
          id: comments.length + 1,
          name: "You",
          time: "Just now",
          text: commentText,
          likes: 0,
          replies: 0,
        },
        ...comments,
      ]);
      setCommentText("");
    }
  };
  // If not mounted, show a simple loading state
  if (!isMounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-5 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row">
          {/* Main content */}
          <div className="w-full lg:w-3/4 lg:pr-8">
            {/* Author info */}
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h3 className="font-medium">Author</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>3 days ago</span>
                  <span className="mx-2">•</span>
                  <span>05 Mei 2025</span>
                </div>
              </div>
            </div>

            {/* Article title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Build an Agentic Workflow for your BigQuery data using LangGraph
              and Gemini
            </h1>
            {/* Gallery Component */}
            <InteractiveGallery galleryItems={galleryItems} className="mb-8" />
            {/* Article content */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg mb-4">
                Building on my{" "}
                <a href="#" className="text-blue-600 underline">
                  previous introduction to data agents
                </a>
                , this blog explores how LangGraph can be used to build agentic
                workflows for your data. We'll use data stored in BigQuery, but
                you can easily swap out the data store as needed.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                What is LangGraph?
              </h2>
              <p className="mb-4">
                LangGraph is an open source python framework for building
                agentic workflows using graphs. LangGraph extends LangChain's
                functionality by supporting more low-level development and
                cyclical graphs, allowing for more stateful and complex
                workflows.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                The Building Blocks
              </h2>
              <p className="mb-4">
                Workflows in LangGraph are defined using graphs. A graph is made
                up of nodes and edges:
              </p>

              <div className="bg-gray-200 h-64 w-full mb-6 flex items-center justify-center">
                <span className="text-gray-500">Diagram placeholder</span>
              </div>

              <h2 className="text-xl font-bold mt-6 mb-3">
                Setting up the Environment
              </h2>
              <p className="mb-4">
                Before we start building our workflow, we need to set up our
                environment with the necessary dependencies. We'll need to
                install LangGraph, the Google Cloud BigQuery library, and Gemini
                API access.
              </p>

              <div className="bg-gray-100 p-4 rounded-md mb-6">
                <code className="text-sm">
                  pip install langgraph google-cloud-bigquery
                  google-generativeai
                </code>
              </div>

              <h2 className="text-xl font-bold mt-6 mb-3">
                Connecting to BigQuery
              </h2>
              <p className="mb-4">
                Next, we'll set up a connection to BigQuery. This will allow our
                agent to query and manipulate data stored in BigQuery.
              </p>

              <h2 className="text-xl font-bold mt-6 mb-3">
                Building the Workflow
              </h2>
              <p className="mb-4">
                Now we can start building our workflow using LangGraph. We'll
                create a graph with nodes for data extraction, analysis, and
                visualization.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-3">Conclusion</h2>
              <p className="mb-4">
                With LangGraph and Gemini, we can build powerful agentic
                workflows that can analyze and manipulate data stored in
                BigQuery. This approach can be extended to other data sources
                and can be customized for various use cases.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                BigQuery
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                LangGraph
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Gemini
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Data Agents
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                AI
              </span>
            </div>

            {/* Interaction bar */}
            {/* <InteractionBar
              initialLikes={120}
              commentsCount={45}
              initialIsLiked={true}
              initialIsBookmarked={false}
            /> */}

            {/* Comments section */}
            <CommentSection />
          </div>

          {/* Sidebar */}
          <SidebarArticle />
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
