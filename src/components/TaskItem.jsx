import React, { useEffect, useState } from "react";
import { formatRemainingTime } from "../utils/formatRemainingTime";

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
  const [remaining, setRemaining] = useState(
    formatRemainingTime(task.deadline)
  );

  useEffect(() => {
    if (!task.deadline) return;

    const interval = setInterval(() => {
      setRemaining(formatRemainingTime(task.deadline));
    }, 60000);

    return () => clearInterval(interval);
  }, [task.deadline]);

  const isExpired = remaining === "Expired";

  return (
    <div
      className={`relative bg-gray-100 p-3 sm:p-4 rounded-md shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
        isExpired
          ? "opacity-60 hover:opacity-100"
          : "opacity-100 hover:shadow-md"
      }`}
    >
      {task.deadline && (
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
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
          <p className="text-xs sm:text-sm">{task.description}</p>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 self-end sm:self-center">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-500 hover:underline text-sm sm:text-base"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-red-500 hover:underline text-sm sm:text-base"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
