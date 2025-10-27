import React, { useState } from "react";
import TodoList from "./TodoList";
import "./App.css";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [showIncompleted, setShowIncompleted] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleAdd = () => {
    if (newTodoText.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText("");
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: number) =>
    setTodos(todos.filter((todo) => todo.id !== id));
  const handleEdit = (id: number, newText: string, newDate?: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText, dueDate: newDate } : todo
      )
    );
  };

  const IncompletedTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="todo">
      <div className="title">
        <h1>My Todo App</h1>
      </div>
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Enter a new task..."
      />

      <input
        type="date"
        value={editingDate}
        onChange={(e) => setEditingDate(e.target.value)}
      />

      <button onClick={handleAdd}>Add</button>
      <p> {editingDate}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowIncompleted(!showIncompleted)}>
          {showIncompleted} Incompleted Tasks
        </button>
        {showIncompleted && (
          <TodoList
            todos={IncompletedTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
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
