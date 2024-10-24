/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TaskModal from "./components/TaskModal";

function App(){
  const [todoData, setTodoData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [targetedListIndex, setTargetedListIndex] = useState(null)

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
    <main className="main-container">
      <h1>Task Manager</h1>
      <div className="todo-container">
        {
          todoData.map((todo,lIdx) =>
            <Fragment key={lIdx} >
              {targetedListIndex === lIdx?
                <div className="list" style={{height:"160px", backgroundColor:"gray"}}></div>
                :<></>
              }
              < TodoList
                listDomRefs={listDomRefs}
                taskDomRefs={taskDomRefs}
                todo={todo} 
                lIdx={lIdx} 
                todoData={todoData} 
                draggedElement={draggedElement}
                setTodoData={setTodoData} 
                setSelectedTask={setSelectedTask}
                setDraggedElement={setDraggedElement}
                setTargetedListIndex={setTargetedListIndex}
              />
            </Fragment>
                
          )
        }

        {targetedListIndex === todoData.length?
          <div className="list" style={{height:"160px", backgroundColor:"gray"}}></div>
          :<></>
         }

        <button className="todo-btn add-list-btn" onClick={handleAddList}>+ Add New List</button>
      </div>

      {/* modal */}
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