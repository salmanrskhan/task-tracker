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

  useEffect(() => {
    if (!task.deadline) {
      setRemaining(null);
      return;
    }

    setRemaining(formatRemainingTime(task.deadline));

    const interval = setInterval(() => {
      setRemaining(formatRemainingTime(task.deadline));
    }, 60000);

    return () => clearInterval(interval);
  }, [task.deadline]);

  const isExpired = remaining === "Expired";

  // Description handling
  const description = task.description?.trim()
    ? task.description
    : "No description added. Click edit to update it.";

  const isLong = description.length > 65; // cutoff for toggle

  const displayedText =
    isLong && !showMore ? description.slice(0, 65) + "..." : description;

  return (
    <div
      className={`relative bg-gray-100 p-3 sm:p-4 rounded-md shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
        isExpired
          ? "opacity-60 hover:opacity-100"
          : "opacity-100 hover:shadow-md"
      }`}
    >
      {remaining && (
        <span
          className={`absolute top-2 right-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
            remaining === "Expired"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {remaining}
        </span>
      )}

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
          <p className="text-gray-600 text-sm italic">
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

      <div className="absolute bottom-2 right-2 flex items-center gap-1">
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
