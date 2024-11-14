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

    const [boards, setBoards] = useState([{title:"My tasks", taskLists:[] }]);
    const [taskLists, setTaskLists] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [boardIndex, setBoardIndex] = useState(0);
    const [targetedListIndex, setTargetedListIndex] = useState(null);
    const [targetedTaskIndex, setTargetedTaskIndex] = useState(null);
    const [themeState,  setThemeState] = useLocalStorage("theme", theme.light);

    const listDomRefs = useRef(new Array());
    const taskDomRefs = useRef(new Array());

    useEffect(function(){
        const localStorageBoards = localStorage.getItem("boards");
        if(localStorageBoards){
            setBoards(JSON.parse(localStorageBoards))
        }
    },[])

    useEffect(function(){
        if(boards.length){
            localStorage.setItem("boards", JSON.stringify(boards));
            setTaskLists(boards[boardIndex].taskLists);
        }
    },[boards])

    function handleAddList(){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists.push({title:"", tasks:[]});

        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    const themeStyle = {
        color:themeState.foreground,
        backgroundColor: themeState.background
    }

    return (
        <main className="main-container" style={themeStyle}>
            <div className="header-container">
                <h1>Task Manager</h1>
                <button onClick={() =>  themeState === theme.light ? setThemeState(theme.dark) : setThemeState(theme.light)} className="theme-btn">
                    {themeState === theme.light ? <CiLight size={20}/> : <MdNightlight size={20}/>}
                </button>
            </div>
            <div className="todo-container">
                {
                    taskLists.map((todo,lIdx) =>
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
                                taskLists={taskLists}
                                draggedElement={draggedElement}
                                targetedTaskIndex={targetedTaskIndex}
                                boardIndex={boardIndex}
                                setBoards={setBoards}
                                setSelectedTask={setSelectedTask}
                                setDraggedElement={setDraggedElement}
                                setTargetedListIndex={setTargetedListIndex}
                                setTargetedTaskIndex={setTargetedTaskIndex}
                            />
                        </Fragment>
                    )
                }

                {targetedListIndex === taskLists.length?
                    <div className="list" style={{height:"160px", backgroundColor:"gray"}}></div>
                    :<></>
                }

                <button className="todo-btn add-list-btn" onClick={handleAddList}>+ Add New List</button>
            </div>

            {/* modal */}
            {selectedTask &&
                <TaskModal
                    task={taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex]}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    taskLists={taskLists}
                    setBoards={setBoards}
                    boardIndex={boardIndex}
                />
            }
        </main>
    )
}

export default App;