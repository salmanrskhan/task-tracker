import TaskItem from "./TaskItem";
import { AnimatePresence, motion } from "framer-motion";

const TaskList = ({ tasks, onEdit, onDelete, onToggle, onMove, isSorted }) => {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        <AnimatePresence initial={false}>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <TaskItem
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
                onMove={onMove}
                canMoveUp={index > 0}
                canMoveDown={index < tasks.length - 1}
                disableReorder={isSorted}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;
