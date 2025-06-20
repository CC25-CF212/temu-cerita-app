// components/TemuCeritaChat.jsx
import { useState, useEffect } from "react";
import LottieAnimation from "./LottieAnimation";

const TemuCeritaChat = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I'm CC25-CF212. Let's get you started with TemuCerita 😊",
      title: "TemuCerita is Indonesia's leading story sharing platform.",
    },
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const [data, setData] = useState({
    popularArticles: [],
    recommendedArticles: [],
    faqs: [
      {
        question: "How do I publish my story?",
        answer: "To publish your story, click on the 'Create' button on the homepage, write your story, and hit publish when you're done!",
      },
      {
        question: "Can I edit my published story?",
        answer: "Yes, you can edit your published story by going to your profile, selecting the story, and clicking the edit button.",
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const formatDate = () => {
      const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
      ];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const now = new Date();
      const dayName = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];

      return `${dayName} ${date}, ${month}`;
    };

    setCurrentDate(formatDate());

    // Add event listener to close chat on ESC key
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Fetch data when component mounts
    if (isOpen) {
      fetchArticlesData();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Fetch artikel populer dan rekomendasi dari API
  const fetchArticlesData = async () => {
    setLoading(true);
    try {
      // Fetch artikel populer (dengan kategori atau kriteria tertentu)
      const popularResponse = await fetch('/api/article/kondisi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // // Kriteria untuk artikel populer - bisa disesuaikan
          // category: '', // kosongkan untuk semua kategori
          // province: '', // kosongkan untuk semua provinsi
        }),
      });

      const popularData = await popularResponse.json();
      
      // Fetch artikel rekomendasi (dengan kriteria berbeda)
      const recommendedResponse = await fetch('/api/articles/rekomendasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Kriteria untuk artikel rekomendasi
          // category: 'Travel', // contoh: fokus pada kategori Travel
          // province: '', 
          ids:[]
        }),
      });

      const recommendedData = await recommendedResponse.json();

      console.log("aaaa - recommendedData" ,recommendedData)
      console.log("aaaa - popularData" ,popularData)
      if (popularData.success && recommendedData.success) {
        // Sort artikel populer berdasarkan likes (descending)
        const sortedPopular = popularData.articles
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 3); // ambil 3 teratas

        // Sort artikel rekomendasi berdasarkan tanggal terbaru
        const sortedRecommended = recommendedData.articles
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // ambil 3 teratas

        setData(prevData => ({
          ...prevData,
          popularArticles: sortedPopular.map(article => ({
            id: article.id,
            title: article.title,
            author: article.author.name,
            likes: article.likes,
            category: article.category,
            province: article.province,
            city: article.city,
          })),
          recommendedArticles: sortedRecommended.map(article => ({
            id: article.id,
            title: article.title,
            author: article.author.name,
            likes: article.likes,
            category: article.category,
            province: article.province,
            city: article.city,
          })),
        }));
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Fallback ke data sample jika API gagal
      setData(prevData => ({
        ...prevData,
        popularArticles: [
          { id: 1, title: "The Mountain Journey", author: "Lia Sutanto", likes: 1245 },
          { id: 2, title: "A Day in Jakarta", author: "Budi Permana", likes: 984 },
          { id: 3, title: "Memories of Bali", author: "Indah Putri", likes: 876 },
        ],
        recommendedArticles: [
          { id: 4, title: "Hidden Treasures of Jogja", author: "Arif Rahman", likes: 742 },
          { id: 5, title: "Surabaya's Street Food", author: "Maya Wijaya", likes: 658 },
          { id: 6, title: "Lombok Adventure", author: "Reza Pratama", likes: 589 },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessages = [
      ...messages,
      {
        id: messages.length + 1,
        type: "user",
        text: message,
      },
    ];

    setMessages(newMessages);
    setMessage("");
    setShowOptions(false);

    // Improved FAQ matching with better keyword detection
    setTimeout(() => {
      const userMessage = message.toLowerCase();
      let matchedFaq = null;

      // Check for specific keywords in user message
      if (userMessage.includes('publish') || userMessage.includes('post') || userMessage.includes('tulis')) {
        matchedFaq = data.faqs.find(faq => faq.question.toLowerCase().includes('publish'));
      } else if (userMessage.includes('edit') || userMessage.includes('ubah')) {
        matchedFaq = data.faqs.find(faq => faq.question.toLowerCase().includes('edit'));
      } else if (userMessage.includes('premium') || userMessage.includes('membership') || userMessage.includes('berlangganan')) {
        matchedFaq = data.faqs.find(faq => faq.question.toLowerCase().includes('premium'));
      } else {
        // Original FAQ matching logic
        matchedFaq = data.faqs.find(
          (faq) =>
            faq.question.toLowerCase().includes(userMessage) ||
            userMessage.includes(faq.question.toLowerCase())
        );
      }

      if (matchedFaq) {
        setMessages([
          ...newMessages,
          {
            id: newMessages.length + 1,
            type: "bot",
            text: matchedFaq.answer,
          },
        ]);
      } else {
        // Enhanced bot response with suggestions
        let botResponse = "Maaf, saya tidak mengerti pertanyaan Anda. ";
        
        if (userMessage.includes('artikel') || userMessage.includes('cerita')) {
          botResponse += "Apakah Anda ingin melihat artikel populer atau rekomendasi artikel?";
        } else if (userMessage.includes('help') || userMessage.includes('bantuan')) {
          botResponse += "Silakan pilih topik bantuan di bawah ini atau tanyakan tentang cara publish artikel, edit artikel, atau membership premium.";
        } else {
          botResponse += "Silakan pilih topik di bawah atau ajukan pertanyaan lain tentang TemuCerita.";
        }

        setMessages([
          ...newMessages,
          {
            id: newMessages.length + 1,
            type: "bot",
            text: botResponse,
          },
        ]);
        
        setShowOptions(true);
      }
    }, 1000);
  };

  const handleOptionClick = (option, type) => {
    let responseText = "";

    if (type === "article") {
      responseText = `"${option.title}" by ${option.author} is a great choice! This story has ${option.likes} likes.`;
      
      if (option.category) {
        responseText += ` It's categorized under ${option.category}.`;
      }
      
      if (option.province && option.city) {
        responseText += ` This story is from ${option.city}, ${option.province}.`;
      }

      const newMessages = [
        ...messages,
        {
          id: messages.length + 1,
          type: "user",
          text: `I want to read "${option.title}"`,
        },
      ];

      setMessages(newMessages);

      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            id: newMessages.length + 1,
            type: "bot",
            text: responseText,
          },
          {
            id: newMessages.length + 2,
            type: "bot",
            text: "Redirecting you to the article...",
            isLink: true,
            linkTo: `/pages/article/detail/${option.id}`,
            linkText: "Click here if you're not redirected automatically",
          },
        ]);

        // Redirect to article page
        setTimeout(() => {
          window.location.href = `/pages/article/detail/${option.id}`;
        }, 1500);
      }, 800);
    } else if (type === "faq") {
      responseText = option.answer;

      const newMessages = [
        ...messages,
        {
          id: messages.length + 1,
          type: "user",
          text: option.question,
        },
      ];

      setMessages(newMessages);

      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            id: newMessages.length + 1,
            type: "bot",
            text: responseText,
          },
        ]);
      }, 800);
    }

    setShowOptions(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowOptions(true);
      fetchArticlesData(); // Refresh data ketika chat dibuka
    }
  };

  return (
    <div className="chat-widget fixed bottom-4 right-4 z-40">
      {/* Chat Bubble Button */}
      <div
        className="w-20 h-16 rounded-full flex items-center justify-center cursor-pointer"
        onClick={toggleChat}
      >
        <LottieAnimation src="/animasi/chat.json" />
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div
          className={`w-80 md:w-96 h-96 rounded-lg shadow-xl flex flex-col overflow-hidden absolute bottom-16 right-0 ${
            darkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-black border border-gray-200"
          }`}
        >
          {/* Chat Header */}
          <div
            className={`p-4 flex justify-between items-center ${
              darkMode
                ? "bg-gray-800 border-b border-gray-700"
                : "bg-gray-50 border-b border-gray-200"
            }`}
          >
            <div>
              <div
                className={`font-bold ${
                  darkMode ? "text-white" : "text-blue-600"
                }`}
              >
                TemuCerita
              </div>
              <div
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Artikel & Bantuan
              </div>
            </div>
            <div
              className={`text-xl cursor-pointer ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              onClick={toggleChat}
            >
              ×
            </div>
          </div>

          {/* Date Display */}
          <div
            className={`text-center py-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {currentDate}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                {msg.type === "bot" ? (
                  <div className="flex items-start">
                    <div
                      className={`mr-2 p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-700"
                          : "bg-gradient-to-r from-purple-200 to-blue-200"
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                      {msg.title && (
                        <div className="font-bold text-sm mt-1">
                          {msg.title}
                        </div>
                      )}
                      {msg.isLink && (
                        <a
                          href={msg.linkTo}
                          className={`block mt-2 text-sm underline ${
                            darkMode ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          {msg.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div
                      className={`p-3 rounded-lg max-w-3/4 ${
                        darkMode ? "bg-gray-600" : "bg-gray-100"
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm">Loading articles...</span>
              </div>
            )}

            {/* Show Article Options */}
            {showOptions && !loading && (
              <div className="mt-4">
                {/* Popular Articles */}
                {data.popularArticles.length > 0 && (
                  <>
                    <div
                      className={`font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Artikel Populer:
                    </div>
                    <div className="space-y-2">
                      {data.popularArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleOptionClick(article, "article")}
                          className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{article.title}</span> - {article.author}
                              <div className="text-xs opacity-75">
                                {article.category} • {article.likes} likes
                              </div>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={darkMode ? "#a0aec0" : "#4a5568"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Recommended Articles */}
                {data.recommendedArticles.length > 0 && (
                  <>
                    <div
                      className={`font-medium mt-4 mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Rekomendasi Untuk Anda:
                    </div>
                    <div className="space-y-2">
                      {data.recommendedArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleOptionClick(article, "article")}
                          className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{article.title}</span> - {article.author}
                              <div className="text-xs opacity-75">
                                {article.category} • {article.likes} likes
                              </div>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={darkMode ? "#a0aec0" : "#4a5568"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* FAQ Section */}
                <div
                  className={`font-medium mt-4 mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  FAQ:
                </div>
                <div className="space-y-2">
                  {data.faqs.map((faq, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(faq, "faq")}
                      className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {faq.question}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSubmit}
            className={`p-4 flex ${
              darkMode ? "border-t border-gray-700" : "border-t border-gray-200"
            }`}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tanyakan sesuatu..."
              className={`flex-1 p-2 rounded-full outline-none ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-black"
              }`}
            />
            <button
              type="submit"
              className={`ml-2 p-2 rounded-full ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TemuCeritaChat;