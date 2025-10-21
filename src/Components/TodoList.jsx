import React, { useState } from 'react'

function ToDoList(){

  const [tasks, setTasks]= useState([]);
  const [newTask, setNewTask] = useState("");

  function handleInputChange(event){
    setNewTask (event.target.value);

  }

  function addTask(){

  }

function deleteTask(index){

}

function moveTaskUp(index){

}

function moveTaskDown(index){
  
}

  return(
  <div className="My ToDo App">
    <h1>My ToDo App</h1>

<div>
  <input 
  type="text"
  placeholder='enter a tesk.....'
  value={newTask}
  onChange={handleInputChange}/>
  <button
     className="add-button"
     onclick={addTask}>
      Add
     </button>
</div>

<ol>
  {tasks.map((task,index) =>
  <li></li>
  )}
</ol>
  </div>);
}
export default TodoList
