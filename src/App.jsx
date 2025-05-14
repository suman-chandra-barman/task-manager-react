import {useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TaskModal from "./components/TaskModal";
import { CiLight } from "react-icons/ci";
import { MdNightlight } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { ThemeContext } from "./context/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Sidebar from "./components/Sidebar.jsx";
import { defaultBoards } from "./helper/constant.js";

function App(){
    const theme = useContext(ThemeContext);

    const [boards, setBoards] = useState([]);
    const [taskLists, setTaskLists] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [boardIndex, setBoardIndex] = useState(0);
    const [targetedListIndex, setTargetedListIndex] = useState(null);
    const [targetedTaskIndex, setTargetedTaskIndex] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [themeState,  setThemeState] = useLocalStorage("theme", theme.dark);

    const listDomRefs = useRef(new Array());
    const taskDomRefs = useRef(new Array());

    useEffect(function(){
        const localStorageBoards = localStorage.getItem("boards");
        if(localStorageBoards){
            setBoards(JSON.parse(localStorageBoards))
        }else{
            localStorage.setItem("boards",JSON.stringify(defaultBoards))
        }
    },[])

    useEffect(function(){
        if(boards?.length){
            localStorage.setItem("boards", JSON.stringify(boards));
        }
    },[boards])

    useEffect(function(){
        if(boards?.length){
            setTaskLists(boards[boardIndex]?.taskLists);
        }
    },[boards, boardIndex]);

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
        <main className="container-wrapper" style={themeStyle}>
            <Sidebar
                boards={boards}
                setBoards={setBoards}
                setBoardIndex={setBoardIndex}
                boardIndex={boardIndex}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />
            {boards.length > 0 ?
                <div className="main-container">
                    <div className="header-container">
                        <h1>{boards[boardIndex]?.title}</h1>
                        <button
                            onClick={() => themeState === theme.light ? setThemeState(theme.dark) : setThemeState(theme.light)}
                            className="theme-btn">
                            {themeState === theme.light ? <CiLight size={20}/> : <MdNightlight size={20}/>}
                        </button>
                    </div>
                    <div className="todo-container"   style={{width: isCollapsed ? 'calc(100vw - 24px)' : 'calc(100vw - 250px)'}}>
                        {taskLists.map((todo, lIdx) =>
                            <div key={lIdx}>
                                {targetedListIndex === lIdx ?
                                    <div className="list" style={{height: "160px", backgroundColor: "gray"}}></div>
                                    : <></>
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
                            </div>
                        )}

                        {targetedListIndex === taskLists.length ?
                            <div className="list" style={{height: "160px", backgroundColor: "gray"}}></div>
                            : <></>
                        }

                        <button className="todo-btn add-list-btn" onClick={handleAddList}>
                            <FaPlus/>
                            Add New List
                        </button>
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
                </div>
                :
                <div className="empty-board" onClick={() => setIsAddBoardModalOpen(!isAddBoardModalOpen)}>
                    Create a board🫡
                </div>
            }
        </main>
    )
}

export default App;