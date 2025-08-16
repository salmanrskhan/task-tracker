import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete, onToggle }) => {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
