import React, { useEffect, useState } from "react";
import { formatRemainingTime } from "../utils/formatRemainingTime";
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from "react-icons/fa";

const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggle,
  onMove,
  canMoveUp,
  canMoveDown,
  disableReorder,
}) => {
  const [remaining, setRemaining] = useState(
    task.deadline ? formatRemainingTime(task.deadline) : null
  );
  const [showMore, setShowMore] = useState(false);
  const [earlyMessage, setEarlyMessage] = useState("");

  // 🔹 Timer handling
  useEffect(() => {
    if (!task.deadline) {
      setRemaining(null);
      return;
    }

    if (task.completed) {
      const timeLeft = formatRemainingTime(task.deadline);
      if (timeLeft !== "Expired") {
        setEarlyMessage(timeLeft); // e.g. "2h 10m"
      }
      setRemaining(null);
      return;
    }

    setRemaining(formatRemainingTime(task.deadline));
    const interval = setInterval(() => {
      setRemaining(formatRemainingTime(task.deadline));
    }, 60000);

    return () => clearInterval(interval);
  }, [task.deadline, task.completed]);

  const isExpired = remaining === "Expired";

  // 🔹 Responsive text cutoff
  function useBreakpoint(limit = 500) {
    const [isSmall, setIsSmall] = useState(window.innerWidth < limit);

    useEffect(() => {
      const handler = () => setIsSmall(window.innerWidth < limit);
      window.addEventListener("resize", handler);
      handler();
      return () => window.removeEventListener("resize", handler);
    }, [limit]);

    return isSmall;
  }

  const description = task.description?.trim()
    ? task.description
    : "No description added. Click edit to update it.";

  const isSmall = useBreakpoint(500);
  const charLimit = isSmall ? 30 : 70;
  const isLong = description.length > charLimit;
  const displayedText =
    isLong && !showMore ? description.slice(0, charLimit) + "..." : description;

  return (
    <div
      className={`relative bg-gray-100 p-3 sm:p-4 rounded-md shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
        isExpired
          ? "opacity-60 hover:opacity-100"
          : "opacity-100 hover:shadow-md"
      }`}
    >
      {/* 🔹 Deadline / Status Badge */}
      {(remaining || earlyMessage) && (
        <span
          className={`absolute top-[6px] right-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold shadow-md
      ${
        remaining === "Expired"
          ? "bg-red-600 text-white animate-pulse"
          : task.completed
          ? "bg-green-600 text-white"
          : "bg-blue-600 text-white"
      }`}
        >
          {task.completed && earlyMessage ? `+${earlyMessage}` : remaining}
        </span>
      )}

      {/* 🔹 Main Content */}
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full">
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-600 mt-1 sm:mt-0"
        />

        <div
          className={`${
            task.completed ? "line-through text-gray-400" : ""
          } text-left flex-1`}
        >
          <h3 className="font-semibold text-base sm:text-lg">{task.title}</h3>
          <p className="text-gray-600 text-sm italic whitespace-normal break-words">
            {displayedText}
          </p>
          {isLong && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-blue-600 text-xs mt-1 hover:underline"
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Action Buttons */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10 bg-gray-200 rounded-md shadow-sm px-1 py-0.5 sm:px-2 sm:py-1">
        {!disableReorder && (
          <div className="flex">
            {/* Move Up */}
            <button
              onClick={() => onMove(task.id, "up")}
              disabled={!canMoveUp}
              className={`p-1 rounded transition duration-200 
                ${
                  canMoveUp
                    ? "hover:bg-gray-100 hover:scale-110 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
              title="Move up"
            >
              <FaArrowUp className="text-gray-600 text-sm" />
            </button>

            {/* Move Down */}
            <button
              onClick={() => onMove(task.id, "down")}
              disabled={!canMoveDown}
              className={`p-1 rounded transition duration-200 
                ${
                  canMoveDown
                    ? "hover:bg-gray-100 hover:scale-110 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
              title="Move down"
            >
              <FaArrowDown className="text-gray-600 text-sm" />
            </button>
          </div>
        )}

        {!task.completed && (
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded text-blue-600 hover:text-blue-800 
                     hover:bg-blue-50 transition hover:scale-110 cursor-pointer"
            title="Edit task"
          >
            <FaEdit className="text-sm" />
          </button>
        )}

        <button
          onClick={() => onDelete(task)}
          className="p-1 rounded text-red-600 hover:text-red-800 
                   hover:bg-red-50 transition hover:scale-110 cursor-pointer"
          title="Delete task"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
