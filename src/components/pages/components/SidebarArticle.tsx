"use client";

import React from "react";

const SidebarArticle: React.FC = () => {
  return (
    <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
      {/* About the Author */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-bold text-lg mb-4">About the Author</h3>
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 mr-3"></div>
          <div>
            <h4 className="font-medium">Ananda Ganteng</h4>
            <p className="text-sm text-gray-500">Data Engineer at Google</p>
          </div>
        </div>
        <p className="text-sm mb-4">
          Writing about data engineering, AI, and cloud technologies. Passionate
          about building intelligent systems and data pipelines.
        </p>
        <button className="w-full bg-black text-white py-2 rounded-full text-sm">
          Follow
        </button>
      </div>

      {/* More from TemuCerita */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-4">More from TemuCerita</h3>
        <div className="space-y-4">
          {[
            {
              title:
                "Introduction to Data Agents: Making Your Data Work for You",
              date: "5 days ago",
            },
            {
              title: "Using Gemini for Advanced Data Analysis",
              date: "1 week ago",
            },
            {
              title: "BigQuery Best Practices for 2025",
              date: "2 weeks ago",
            },
          ].map((item, index) => (
            <div className="flex items-start" key={index}>
              <div className="h-12 w-12 bg-gray-300 rounded mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarArticle;
