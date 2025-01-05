// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

Chart.register(...registerables);

type Article = {
  title?: string;
  author?: string;
  description?: string;
  publishedAt?: string;
  url?: string;
};

export default function Dashboard() {
  const [news, setNews] = useState<Article[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    author: "",
    dateRange: { from: "", to: "" },
    type: "",
  });

  const [authorCounts, setAuthorCounts] = useState<{ [key: string]: number }>({});
  const [typeCounts, setTypeCounts] = useState<{ [key: string]: number }>({});

  const fetchNews = async (query: string = "") => {
    try {
      const response = await fetch(`/api/news?search=${query || "latest"}`);
      const data: Article[] = await response.json();
      setNews(data);
      calculateTrends(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  const calculateTrends = (articles: Article[]) => {
    const authorCount: { [key: string]: number } = {};
    const typeCount: { [key: string]: number } = {};

    articles.forEach((article) => {
      const author = article.author || "Unknown Author";
      authorCount[author] = (authorCount[author] || 0) + 1;

      const type = filters.type || "General";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    setAuthorCounts(authorCount);
    setTypeCounts(typeCount);
  };

  useEffect(() => {
    fetchNews("BBC Sports");
  }, []);

  const handleSearch = () => {
    fetchNews(searchKeyword);
  };

  const authorChartData = {
    labels: Object.keys(authorCounts),
    datasets: [
      {
        label: "Articles by Author",
        data: Object.values(authorCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const typeChartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: "Articles by Type",
        data: Object.values(typeCounts),
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 205, 86, 0.6)",
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-screen bg-gray-800 p-4 text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
        The News App
      </h1>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search for news"
          className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Author"
          value={filters.author}
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="flex items-center gap-2">
          <label className="text-gray-400">From:</label>
          <input
            type="date"
            value={filters.dateRange.from}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, from: e.target.value },
              })
            }
            className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-400">To:</label>
          <input
            type="date"
            value={filters.dateRange.to}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, to: e.target.value },
              })
            }
            className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="news">News</option>
          <option value="blogs">Blogs</option>
        </select>
      </div>

      {/* News Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <div
            key={index}
            className="p-4 bg-gray-700 rounded-lg shadow-lg hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-400">
              {article.title || "No Title"}
            </h3>
            <p className="text-sm text-gray-400">
              {article.author || "Unknown Author"} -{" "}
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "Unknown Date"}
            </p>
            <p className="text-gray-300 mt-2 line-clamp-3">
              {article.description || "No Description"}
            </p>
            <a
              href={article.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 block"
            >
              Read more
            </a>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <Bar data={authorChartData} />
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <Pie data={typeChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
