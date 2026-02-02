import React from "react";
import type { Todo } from "./App";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}) => {
  if (todos.length === 0) return <p>No tasks here</p>;

  console.log("TodoList recevied todos:", todos);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span className={`head ${todo.isComplete ? "completed" : ""}`}>
            {todo.name}{" "}
            {todo.dueDate ? `(Due: ${todo.dueDate.split("T")[0]})` : ""}
            {todo.completedDate
              ? `(Completed: ${todo.completedDate.split("T")[0]})`
              : ""}{" "}
          </span>
          <br />
          <button className="btn" onClick={() => onToggle(todo.id)}>
            {todo.isComplete ? "❌Incomplete" : "✅Complete"}
          </button>
          <button className="btn" onClick={() => onEdit(todo.id)}>
            ✏️ Edit
          </button>
          <button className="btn" onClick={() => onDelete(todo.id)}>
            🗑️ Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
