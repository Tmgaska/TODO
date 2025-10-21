import React from "react";
import type { Todo } from "./App";
interface TodoListProps {
  todos: Todo[];
}
const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  console.log("TodoList received:", todos);
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
};

export default TodoList;
