/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TaskModal from "./components/TaskModal";

function App(){
  const [todoData, setTodoData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);

  const listDomRefs = useRef(new Array());
  const taskDomRefs = useRef(new Array());

  useEffect(function(){
      const localStorageTodoData = localStorage.getItem("todoData");
      
      if(localStorageTodoData){
        setTodoData(JSON.parse(localStorageTodoData))
      }
  },[])

  useEffect(function(){
    if(todoData.length){
      localStorage.setItem("todoData", JSON.stringify(todoData));
    }
  },[todoData])

 function handleAddList(){
  const updatedTodoData = [...todoData];
  updatedTodoData.push({title:"",tasks:[]});

  setTodoData(updatedTodoData);
 }

  return (
    <main className="main-box">
      <h1>Task Manager</h1>
      <div className="todo-section">
        {
          todoData.map((todo,lIdx) =>
            < TodoList 
                key={lIdx} 
                listDomRefs={listDomRefs}
                taskDomRefs={taskDomRefs}
                todo={todo} 
                lIdx={lIdx} 
                todoData={todoData} 
                draggedElement={draggedElement}
                setTodoData={setTodoData} 
                setSelectedTask={setSelectedTask}
                setDraggedElement={setDraggedElement}
            />
          )
        }
        <button id="add_list_btn" className="todo-btn" onClick={handleAddList}>+ Add New List</button>
      </div>
      {
        selectedTask && 
          <TaskModal 
            task={todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex]}
            selectedTask={selectedTask} 
            setSelectedTask={setSelectedTask}
            todoData={todoData}
            setTodoData={setTodoData}

          />
      }
    </main>
  )
}

export default App;