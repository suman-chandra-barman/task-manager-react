/* eslint-disable no-unused-vars */
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TaskModal from "./components/TaskModal";
import { CiLight } from "react-icons/ci";
import { MdNightlight } from "react-icons/md";
import { ThemeContext, themes } from "./context/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Sidebar from "./components/Sidebar.jsx";

function App(){
  const theme = useContext(ThemeContext);

  const [todoData, setTodoData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [targetedListIndex, setTargetedListIndex] = useState(null);
  const [targetedTaskIndex, setTargetedTaskIndex] = useState(null);
  const [themeState,  setThemeState] = useLocalStorage("theme", theme.light);
  const [boardIndex, setBoardIndex] = useState(0)

  const listDomRefs = useRef(new Array());
  const taskDomRefs = useRef(new Array());

  /*
  [
  {
    "title": "board title",
    "lists": [
      {
        "title": "Todo",
        "tasks": [
          {
            "title": "Math",
            "description": "",
            "checklists": [],
            "comments": []
          },
          {
            "title": "Data Structure",
            "description": "",
            "checklists": [],
            "comments": []
          }
        ]
      },
      {
        "title": "Doing",
        "tasks": [
          {
            "title": "Task manager",
            "description": "",
            "checklists": [
              {
                "name": "Checklist",
                "items": [
                  {
                    "name": "",
                    "isChecked": false
                  },
                  {
                    "name": "",
                    "isChecked": false
                  },
                  {
                    "name": "",
                    "isChecked": false
                  }
                ]
              }
            ],
            "comments": [
              "<p>My Name is Sam</p>",
              "<p>My New comment</p>"
            ]
          },
          {
            "title": "Lixzo",
            "description": "",
            "checklists": [],
            "comments": [
              "<p>New comments</p>"
            ]
          }
        ]
      }
    ]
  }
]
   */

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
  updatedTodoData.push({title:"", tasks:[]});
  setTodoData(updatedTodoData);
 }

 const themeStyle = {
  color:themeState.foreground,
  backgroundColor: themeState.background
 }

 console.log("todoData", todoData)
  return (
      <div className="main-container" style={themeStyle}>
          <Sidebar todoData={todoData} setBoardIndex={setBoardIndex} setTodoData={setTodoData}/>

          <main className="board-container">
              <div className="header-container">
                  <h1>Task Manager</h1>
                  <button
                      onClick={() => themeState === theme.light ? setThemeState(theme.dark) : setThemeState(theme.light)}
                      className="theme-btn">
                      {themeState === theme.light ? <CiLight size={20}/> : <MdNightlight size={20}/>}
                  </button>
              </div>
              {/*<div className="todo-container">*/}
              {/*    {todoData[boardIndex].lists?.map((todo, lIdx) =>*/}
              {/*        <div key={lIdx}>*/}
              {/*            {targetedListIndex === lIdx ?*/}
              {/*                <div className="list" style={{height: "160px", backgroundColor: "gray"}}></div>*/}
              {/*                : <></>*/}
              {/*            }*/}
              {/*            < TodoList*/}
              {/*                listDomRefs={listDomRefs}*/}
              {/*                taskDomRefs={taskDomRefs}*/}
              {/*                todo={todo}*/}
              {/*                lIdx={lIdx}*/}
              {/*                todoData={todoData}*/}
              {/*                draggedElement={draggedElement}*/}
              {/*                targetedTaskIndex={targetedTaskIndex}*/}
              {/*                setTodoData={setTodoData}*/}
              {/*                setSelectedTask={setSelectedTask}*/}
              {/*                setDraggedElement={setDraggedElement}*/}
              {/*                setTargetedListIndex={setTargetedListIndex}*/}
              {/*                setTargetedTaskIndex={setTargetedTaskIndex}*/}
              {/*            />*/}
              {/*        </div>*/}
              {/*    )}*/}

              {/*    {targetedListIndex === todoData[boardIndex].length ?*/}
              {/*        <div className="list" style={{height: "160px", backgroundColor: "gray"}}></div>*/}
              {/*        : <></>*/}
              {/*    }*/}

              {/*    <button className="todo-btn add-list-btn" onClick={handleAddList}>+ Add New List</button>*/}
              {/*</div>*/}

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
      </div>
  )
}

export default App;