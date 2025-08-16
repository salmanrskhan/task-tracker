import axios from "axios";
import React, { useEffect, useState } from "react";

const QuoteCard = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const fetchNewQuote = async (today) => {
    try {
      const res = await axios.get("https://dummyjson.com/quotes/random");
      const newQuote = res.data.quote;
      const newAuthor = res.data.author;

      setQuote(newQuote);
      setAuthor(newAuthor);

      localStorage.setItem(
        "dailyQuote",
        JSON.stringify({
          quote: newQuote,
          author: newAuthor,
          date: today,
        })
      );
    } catch (error) {
      setQuote("Stay positive, work hard, make it happen.");
      setAuthor("Unknown");
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("dailyQuote"));

    if (stored && stored.date === today) {
      setQuote(stored.quote);
      setAuthor(stored.author);
    } else {
      fetchNewQuote(today);
    }

    // Set a timer to refresh the quote at midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1) -
      now;

    const midnightTimer = setTimeout(() => {
      const newDate = new Date().toDateString();
      fetchNewQuote(newDate);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  return (
     <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 md:p-6 rounded shadow mb-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 mb-1">
        Your Daily Motivation 💡
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3">
        Stay focused. Stay driven. Make today count.
      </p>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 italic">
        "{quote}"
      </p>
      <p className="text-right text-xs sm:text-sm md:text-base text-blue-600 mt-2">
        — {author}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-2 italic">
        🔁 New quote appears daily at midnight (00:00)
      </p>
    </div>
  );
};

export default QuoteCard;
