import React, { useState } from "react";
import type { Todo } from "./App";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (editingId !== null && editingText.trim() !== "") {
      onEdit(editingId, editingText);
      setEditingId(null);
      setEditingText("");
    }
  };

  return (
    <ul>
      {todos.length === 0 ? (
        <p>No tasks here.</p>
      ) : (
        todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "8px" }}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginRight: "10px",
                  }}
                >
                  {todo.text}
                </span>
                <button onClick={() => onToggle(todo.id)}>
                  {todo.completed ? "Incomplete" : "Complete"}
                </button>
                <button
                  onClick={() => startEditing(todo)}
                  style={{ marginLeft: "5px" }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  style={{ marginLeft: "5px" }}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </li>
        ))
      )}
    </ul>
  );
};

export default TodoList;
