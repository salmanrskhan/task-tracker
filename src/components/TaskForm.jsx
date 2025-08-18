import React, { useEffect, useState } from "react";

const TaskForm = ({ addTask, editingTask, updateTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDeadline(editingTask.deadline || "");
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      title,
      description,
      deadline: deadline || null,
      createdAt: editingTask
        ? editingTask.createdAt
        : new Date().toLocaleString(),
    };

    if (editingTask) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }

    setTitle("");
    setDescription("");
    setDeadline("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mb-6 bg-white p-4 rounded shadow"
    >
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-0 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               text-sm sm:text-base text-gray-700 placeholder-gray-400"
          required
        />
        <p className="text-xs text-gray-400 text-right">{title.length}/50</p>
      </div>

      <div className="flex flex-col">
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-0 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               text-sm sm:text-base text-gray-700 placeholder-gray-400 
               resize-none"
          rows={3}
        />
        <p className="text-xs text-gray-400 text-right">
          {description.length}/200
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-0 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               text-sm sm:text-base text-gray-700"
        />
        <p className="text-xs text-gray-400 text-right italic">
          Optional: Set a deadline
        </p>
      </div>

      <button
        type="submit"
        className={`w-full sm:w-auto px-4 py-2 rounded transition text-white 
    ${
      !title.trim()
        ? "bg-gray-300 cursor-not-allowed"
        : editingTask
        ? "bg-green-600 hover:bg-green-700"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
        disabled={!title.trim()}
        title={!title.trim() ? "Enter a title first" : ""}
      >
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
