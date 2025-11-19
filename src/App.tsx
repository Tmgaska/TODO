import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import "./App.css";

export interface Todo {
  id: number;
  name: string;
  isComplete: boolean;
  dueDate?: string;
  completedDate?: string | null;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const maxLength = 99;
  const isTodoTooLong = newTodoText.length > maxLength;
  const [newTodoDate, setNewTodoDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showIncompleted, setShowIncompleted] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  console.log("todos", todos);

  useEffect(() => {
    fetch("https://localhost:44376/api/TodoItems")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          isComplete: d.isComplete,
          dueDate: d.dueDate,
          completedDate: d.completedDate,
        }));
        setTodos(mapped);
        console.log("Fetched todos:", mapped);
      })
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  const handleAddOrSave = () => {
    if (newTodoText.trim() === "" || isTodoTooLong) return;

    if (editingId !== null) {
      const todo = todos.find((t) => t.id === editingId);
      if (!todo) return;

      fetch(`https://localhost:44376/api/TodoItems/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: newTodoText,
          isComplete: todo.isComplete,
          dueDate: newTodoDate,
        }),
      })
        .then(() => {
          setTodos(
            todos.map((t) =>
              t.id === editingId
                ? { ...t, name: newTodoText, dueDate: newTodoDate }
                : t
            )
          );
          setEditingId(null);
          setNewTodoText("");
          setNewTodoDate("");
        })
        .catch((err) => console.error("Error saving todo:", err));

      return;
    }

    fetch("https://localhost:44376/api/TodoItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTodoText,
        isComplete: false,
        dueDate: newTodoDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([
          ...todos,
          {
            id: data.id,
            name: data.name,
            isComplete: data.isComplete,
            dueDate: data.dueDate,
          },
        ]);
        setNewTodoText("");
        setNewTodoDate("");
      })
      .catch((err) => console.error("Error adding todo:", err));
  };

  const handleDelete = (id: number) => {
    fetch(`https://localhost:44376/api/TodoItems/${id}`, { method: "DELETE" })
      .then(() => setTodos(todos.filter((t) => t.id !== id)))
      .catch((err) => console.error("Error deleting todo:", err));
  };

  const handleToggle = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const today = new Date().toISOString().split("T")[0];

    const updatedTodo: Todo = {
      ...todo,
      isComplete: !todo.isComplete,
      completedDate: !todo.isComplete ? today : undefined,
    };

    fetch(`https://localhost:44376/api/TodoItems/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    })
      .then(() => {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      })
      .catch((err) => console.error("Error updating todo:", err));
  };

  const handleEdit = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    setEditingId(id);
    setNewTodoText(todo.name);
    setNewTodoDate(todo.dueDate || "");
  };

  const incompleteTodos = todos.filter((t) => !t.isComplete);
  const completedTodos = todos.filter((t) => t.isComplete);

  return (
    <div className="todo">
      <h1>My Todo App</h1>

      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Enter a new task..."
      />

      <input
        type="date"
        value={newTodoDate}
        onChange={(e) => setNewTodoDate(e.target.value)}
      />

      {isTodoTooLong && (
        <p style={{ color: "red", marginTop: "5px" }}>
          文字数が 100 を超えています！
        </p>
      )}

      <button
        onClick={handleAddOrSave}
        disabled={isTodoTooLong || newTodoText.trim() === ""}
      >
        {editingId ? "Save" : "Add"}
      </button>

      <div className="box">
        <button onClick={() => setShowIncompleted(!showIncompleted)}>
          {showIncompleted} Incompleted Tasks
        </button>

        {showIncompleted && (
          <TodoList
            todos={incompleteTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

        <button onClick={() => setShowCompleted(!showCompleted)}>
          {showCompleted} Completed Tasks
        </button>

        {showCompleted && (
          <TodoList
            todos={completedTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default App;
