/* eslint-disable no-unused-vars */
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TaskModal from "./components/TaskModal";
import { CiLight } from "react-icons/ci";
import { MdNightlight } from "react-icons/md";
import { ThemeContext, themes } from "./context/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App(){
  const theme = useContext(ThemeContext);

  const [todoData, setTodoData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [targetedListIndex, setTargetedListIndex] = useState(null);
  const [targetedTaskIndex, setTargetedTaskIndex] = useState(null);
  const [themeState,  setThemeState] = useLocalStorage("theme", theme.light);

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

 const themeStyle = {
  color:themeState.foreground,
  backgroundColor: themeState.background
 }

  return (
    <main className="main-container" style={themeStyle}>
      <div className="header-container">
        <h1>Task Manager</h1>
        <button onClick={() =>  themeState === themes.light ? setThemeState(themes.dark) : setThemeState(themes.light)} className="theme-btn">
          {themeState === themes.light ? <CiLight size={20}/> : <MdNightlight size={20}/>}
        </button>
      </div>
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
                targetedTaskIndex={targetedTaskIndex}
                setTodoData={setTodoData} 
                setSelectedTask={setSelectedTask}
                setDraggedElement={setDraggedElement}
                setTargetedListIndex={setTargetedListIndex}
                setTargetedTaskIndex={setTargetedTaskIndex}
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