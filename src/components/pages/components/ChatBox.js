// components/ChatBox.jsx
import { useState, useEffect } from "react";

const ChatBox = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I'm Logan. Let's get you started 😊",
      title: "TemuCerita is the world's leading story sharing platform.",
    },
    {
      id: 2,
      type: "user",
      text: "Hi there !!",
    },
  ]);

  useEffect(() => {
    const formatDate = () => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
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
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

    // Simulate bot response after a short delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          id: newMessages.length + 1,
          type: "bot",
          text: "Thanks for your message! Our team will get back to you soon.",
        },
      ]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget fixed bottom-4 right-4 z-40">
      {/* Chat Bubble Button */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
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
                Customer Support
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

            {/* Get Started Button */}
            <div className="text-center mt-4">
              <button
                className={`px-4 py-2 rounded-full font-medium ${
                  darkMode
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-white text-blue-600 border border-blue-600"
                }`}
              >
                Let's Get Started
              </button>
            </div>
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
              placeholder="Type your message here..."
              className={`flex-1 p-2 rounded-full outline-none ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-black"
              }`}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
