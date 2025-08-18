import { useEffect, useRef, useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import toast, { Toaster } from "react-hot-toast";
import ConfirmModal from "./components/ConfirmModal";
import confetti from "canvas-confetti";
import QuoteCard from "./components/QuoteCard";
import { AiOutlineClose } from "react-icons/ai";

function App() {
  const originalTasksRef = useRef([]);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const parsed = savedTasks ? JSON.parse(savedTasks) : [];
    originalTasksRef.current = parsed;
    return parsed;
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filter, setFilter] = useState("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const formRef = useRef(null);

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) => (hideCompleted ? !task.completed : true))
    .filter((task) =>
      [task.title, task.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  // .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  // .sort((a, b) => a.completed - b.completed);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prev) => {
      const updated = [...prev, task];
      originalTasksRef.current = updated;
      return updated;
    });
    toast.success("Task added!");
  };

  // const deleteTask = (id) => {
  //   setTasks((prev) => prev.filter((task) => task.id !== id));
  //   toast.error("Task deleted!", { icon: "🗑️" });
  // };

  const startEdit = (task) => {
    setEditingTask(task);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateTask = (updateTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updateTask.id ? updateTask : task))
    );
    setEditingTask(null);
    toast.success("Task updated!", {
      icon: "✏️",
      style: {
        borderRadius: "8px",
        background: "#cbf4d5",
        color: "#333",
        fontWeight: "500",
      },
    });
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => {
        const updated = prev.filter((task) => task.id !== taskToDelete.id);
        originalTasksRef.current = updated;
        return updated;
      });
      toast("Task deleted!", { icon: "🗑️" });
      setShowConfirm(false);
      setTaskToDelete(null);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    const allCompleted =
      tasks.length > 0 && tasks.every((task) => task.completed);

    if (allCompleted && !hasCelebratedRef.current) {
      toast.success("All tasks completed!", {
        icon: "🎉",
        duration: 4000,
        style: {
          borderRadius: "8px",
          background: "#d1fae5",
          color: "#065f46",
          fontWeight: "bold",
        },
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      hasCelebratedRef.current = true;
    }

    if (!allCompleted) {
      hasCelebratedRef.current = false;
    }
  }, [tasks]);

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5).replace(":", "-");
    const filename = `notes-${date}_${time}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const sortByDeadline = () => {
    if (!isSorted) {
      const now = new Date();
      const sorted = [...tasks].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        const remainingA = new Date(a.deadline) - now;
        const remainingB = new Date(b.deadline) - now;

        // Expired tasks always last
        if (remainingA < 0 && remainingB >= 0) return 1;
        if (remainingB < 0 && remainingA >= 0) return -1;

        return remainingA - remainingB;
      });
      setTasks(sorted);
      setIsSorted(true);
    } else {
      // Reset to original order
      setTasks(originalTasksRef.current);
      setIsSorted(false);
    }
  };

  const handleMove = (taskId, direction) => {
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((t) => t.id === taskId);
      if (index === -1) return prevTasks;

      const newTasks = [...prevTasks];
      if (direction === "up" && index > 0) {
        [newTasks[index - 1], newTasks[index]] = [
          newTasks[index],
          newTasks[index - 1],
        ];
      } else if (direction === "down" && index < newTasks.length - 1) {
        [newTasks[index + 1], newTasks[index]] = [
          newTasks[index],
          newTasks[index + 1],
        ];
      }

      return newTasks;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-3 sm:p-5 md:p-6">
        <h1 className="text-2xl font-bold text-center mb-4 sm:mb-6 text-blue-600">
          📝 Task Tracker
        </h1>

        <QuoteCard />

        <div ref={formRef}>
          <TaskForm
            addTask={addTask}
            editingTask={editingTask}
            updateTask={updateTask}
          />
        </div>

        {tasks.length > 0 && (
          <>
            {/* Filter buttons */}
            <div className="flex justify-center text-sm sm:text-lg gap-2 sm:gap-4 my-4">
              {["all", "completed", "pending"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1 rounded-full ${
                    filter === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Hide completed + Clear button */}
            {tasks.some((task) => task.completed) && (
              <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={() => setHideCompleted((prev) => !prev)}
                    className="accent-blue-600"
                  />
                  Hide Completed
                </label>

                <button
                  onClick={() =>
                    setTasks((prev) => prev.filter((task) => !task.completed))
                  }
                  className="text-red-600 hover:underline"
                >
                  Clear Completed 🧹
                </button>
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-4 mb-3">
              <div className="text-sm text-gray-700 text-center mb-1">
                {completedCount} of {totalCount} tasks completed ✅
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    progress === 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Sort + Export */}
            <div className="flex justify-between gap-2 mb-3">
              <button
                onClick={sortByDeadline}
                className={`px-4 py-2 rounded text-sm transition 
          ${
            isSorted
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
              >
                {isSorted ? "Sorted - ⏳" : "Sort - ⏳"}
              </button>

              <button
                onClick={exportTasks}
                className="px-2 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-sm"
              >
                Export Tasks ⬇️
              </button>
            </div>

            {/* Search */}
            <div className="flex justify-center my-3">
              <div className="relative w-full sm:w-2/3">
                <input
                  type="text"
                  placeholder="🔍 Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-8 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 
              text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <AiOutlineClose size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        <TaskList
          tasks={filteredTasks}
          onEdit={startEdit}
          onDelete={handleDeleteRequest}
          onToggle={toggleTaskStatus}
          onMove={handleMove}
          isSorted={isSorted}
        />

        <ConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

export default App;
