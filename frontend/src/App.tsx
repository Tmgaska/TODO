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
  const [showIncompleted, setShowIncompleted] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  console.log("todos", todos);

  useEffect(() => {
    fetch("https://localhost:44376/api/TodoItems")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch todos.");
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        console.log("Fetched todos:", data);
      })
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);
  //handleSave function
  const handleSave = () => {
    if (newTodoText.trim() === "" || isTodoTooLong) return;
    if (editingId !== null) {
      const todo = todos.find((t) => t.id === editingId);
      if (!todo) return;
      //put
      fetch(`https://localhost:44376/api/TodoItems/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          isComplete: todo.isComplete,
          name: newTodoText,
          dueDate: newTodoDate || null,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update todo.");
          //this logic correctly handle 204 responses from your API:
          if (res.status == 204 || res.headers.get("content-length") === "0") {
            const putBody = {
              id: editingId,
              name: newTodoText,
              isComplete: todo.isComplete,
              dueDate: newTodoDate || null,
            };
            return putBody;
          }
          return res.json();
        })
        .then((updatedTodoFromApi) => {
          setTodos(
            todos.map((t) => (t.id === editingId ? updatedTodoFromApi : t))
          );
          setEditingId(null);
          setNewTodoText("");
          setNewTodoDate("");
        })
        .catch((err) => console.error("Error saving todo:", err));
      return;
    }
    //POST
    fetch("https://localhost:44376/api/TodoItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTodoText,
        isComplete: false,
        dueDate: newTodoDate,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add todo.");
        return res.json();
      })
      .then((newTodoFromApi) => {
        setTodos([...todos, newTodoFromApi]); // Json from model
        setNewTodoText("");
        setNewTodoDate("");
      })
      .catch((err) => console.error("Error adding todo:", err));
  };
  //handleDelete function
  const handleDelete = (id: number) => {
    fetch(`https://localhost:44376/api/TodoItems/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete todo on the server.");
        }
        setTodos(todos.filter((t) => t.id !== id));
      })
      .catch((err) => console.error("Error deleting todo:", err));
  };
  //handleToggle checkbox
  const handleToggle = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const today = new Date().toISOString().split("T")[0];
    const newIsComplete = !todo.isComplete;
    const putBody = {
      ...todo,
      isComplete: newIsComplete,
      completedDate: newIsComplete ? today : null,
    };
    //PUT complete\incopmelte
    fetch(`https://localhost:44376/api/TodoItems/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to toggle todo.");
        if (res.status === 204 || res.headers.get("content-length") === "0") {
          return putBody;
        }

        return res.json();
      })
      .then((updatedTodo) => {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      })
      .catch((err) => console.error("Error updating todo:", err));
  };
  //Edit input
  const handleEdit = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    setEditingId(id);
    setNewTodoText(todo.name);
    setNewTodoDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
  };

  const incompleteTodos = todos.filter((t) => !t.isComplete);
  const completedTodos = todos.filter((t) => t.isComplete);

  return (
    <div className="todo">
      <h1>My Todo App</h1>

      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)} //react controls the inuput
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
        onClick={handleSave}
        disabled={isTodoTooLong || newTodoText.trim() === ""}
      >
        {editingId ? "Save" : "Add"}
      </button>

      <div className="box">
        <button onClick={() => setShowIncompleted(!showIncompleted)}>
          Incompleted Tasks ({incompleteTodos.length})
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
          Completed Tasks ({completedTodos.length})
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
