/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa";

function TodoList(
    {
        todo,
        lIdx,
        listDomRefs,
        taskDomRefs,
        taskLists,
        draggedElement,
        targetedTaskIndex,
        boardIndex,
        setBoards,
        setSelectedTask,
        setDraggedElement,
        setTargetedListIndex,
        setTargetedTaskIndex
    }
){
    const [divRect,setDivRect] = useState();
    const [isListDrag, setIsListDrag] = useState(false);
    const [isTaskDrag, setIsTaskDrag] = useState(false);
    const [dragStyle, setDragStyle] = useState({});
    const [taskDragStyle, setTaskDragStyle] = useState({});
    const [nativeOffset, setNativeOffset] = useState();


    function handleAddTask(){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[lIdx].tasks.push({title:"", description:"", checklists:[],comments:[]});

        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleListTitleChange (e,idx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[idx].title = e.target.value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleTaskChange(e,idx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[lIdx].tasks[idx].title = e.target.value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function openTaskModal(listIndex, taskIndex){
        setSelectedTask({listIndex, taskIndex})
    }

    function handleListDrag(event){
        event.stopPropagation();
        if(event.buttons === 1){
            if(!isListDrag){
                setIsListDrag(true);

                setDraggedElement({
                    element:todo,
                    index:lIdx
                })

                setDivRect(event.target.getBoundingClientRect());
                setNativeOffset({x:event.nativeEvent.offsetX, y:event.nativeEvent.offsetY})
            }

            if(divRect && nativeOffset){
                const offsetX = event.pageX - nativeOffset.x;
                const offsetY = event.pageY - nativeOffset.y;

                setDragStyle({
                    position: 'absolute',
                    left: offsetX + "px",
                    top: offsetY + "px"
                });

                for(let i = 0; i < listDomRefs.current.length; i++){
                    const listDomRect = listDomRefs.current[i].getBoundingClientRect();
                    if(i === 0 && event.pageX <= listDomRect.left && i != lIdx){
                        setTargetedListIndex(i);
                        break;
                    }

                    if(i !== 0){
                        const prevListDomRect = listDomRefs.current[i-1].getBoundingClientRect();
                        if(event.pageX >= prevListDomRect.left && event.pageX <= listDomRect.left && i != lIdx){
                            setTargetedListIndex(i);
                            break;
                        }
                    }

                    if(i === taskLists.length-1 && event.pageX >= listDomRect.left){
                        setTargetedListIndex(i+1)
                        break;
                    }
                }
            }
        }
    }

    function handleTaskDrag(event, tIdx){
        event.stopPropagation();
        if(event.buttons === 1){
            if(!isTaskDrag){
                setIsTaskDrag(true);

                setDraggedElement({
                    element:event.target,
                    tIndex:tIdx,
                    lIndex:lIdx
                })

                setDivRect(event.target.getBoundingClientRect());
                setNativeOffset({x:event.nativeEvent.offsetX, y:event.nativeEvent.offsetY})
            }

            if(divRect && nativeOffset){
                const offsetX = event.pageX - nativeOffset.x;
                const offsetY = event.pageY - nativeOffset.y;

                setTaskDragStyle({
                    position: 'absolute',
                    left: offsetX + "px",
                    top: offsetY + "px"
                });

                //get list index
                let listIndex = 0;
                for(let i = 0; i < listDomRefs.current.length; i++){
                    const listDomRect = listDomRefs.current[i].getBoundingClientRect();

                    if(event.pageX >= listDomRect.left && event.pageX <= listDomRect.right){
                        listIndex = i;
                        break;
                    }
                }

                //get task index
                let taskIndex = 0;
                for(let i = 0; i < taskDomRefs.current[listIndex].length; i++){
                    const taskDomRect = taskDomRefs.current[listIndex][i].getBoundingClientRect();
                    if(i === 0 && event.pageY <= taskDomRect.top && i != tIdx){
                        taskIndex = i;
                        break;
                    }

                    if(i !== 0){
                        const prevTaskDomRect = taskDomRefs.current[listIndex][i-1].getBoundingClientRect();
                        if(event.pageY >= prevTaskDomRect.top && event.pageY <= taskDomRect.top && i != tIdx){
                            taskIndex = i;
                            break;
                        }
                    }

                    if(i === taskLists[listIndex].tasks.length-1 && event.pageY >= taskDomRect.top){
                        taskIndex = i + 1;
                        break;
                    }
                }
                setTargetedTaskIndex({lIndex:listIndex,tIndex:taskIndex});
            }
        }
    }

    function handleListDragEnd(event){
        event.stopPropagation();
        for(let i = 0; i < listDomRefs.current.length; i++){
            const listDomRect = listDomRefs.current[i].getBoundingClientRect();

            if(i === 0 && event.pageX <= listDomRect.left && i != lIdx){
                const updatedTaskLists = [...taskLists];
                const dragElement = updatedTaskLists.splice(draggedElement.index, 1)[0];
                const destinationIndex = i;
                updatedTaskLists.splice(destinationIndex, 0, dragElement);

                setBoards((state) => {
                    let newState = [...state];
                    newState[boardIndex].taskLists = updatedTaskLists;
                    return newState;
                });
                break;
            }

            if(i !== 0){
                const prevListDomRect = listDomRefs.current[i-1].getBoundingClientRect();
                if(event.pageX >= prevListDomRect.left && event.pageX <= listDomRect.left && i != lIdx){
                    const updatedTaskLists = [...taskLists];
                    const dragElement = updatedTaskLists.splice(draggedElement.index, 1)[0];
                    const destinationIndex = draggedElement.index < i ? i-1 : i;
                    updatedTaskLists.splice(destinationIndex, 0, dragElement);

                    setBoards((state) => {
                        let newState = [...state];
                        newState[boardIndex].taskLists = updatedTaskLists;
                        return newState;
                    });
                    break;
                }
            }

            if(i === taskLists.length - 1 && event.pageX >= listDomRect.left && i != lIdx){
                const updatedTaskLists = [...taskLists];
                const dragElement = updatedTaskLists.splice(draggedElement.index, 1)[0];
                const destinationIndex = i;

                updatedTaskLists.splice(destinationIndex, 0, dragElement);

                setBoards((state) => {
                    let newState = [...state];
                    newState[boardIndex].taskLists = updatedTaskLists;
                    return newState;
                });
                break;
            }
        }
        setTargetedListIndex(null);
        setIsListDrag(false);
        setDraggedElement(null);
        setDragStyle({});
    }

    function handleTaskDragEnd(event, tIdx){
        event.stopPropagation();

        let listIndex = 0;
        for(let i = 0; i < listDomRefs.current.length; i++){
            const listDomRect = listDomRefs.current[i].getBoundingClientRect();

            if(event.pageX >= listDomRect.left && event.pageX <= listDomRect.right){
                listIndex = i;
                break;
            }
        }

        for(let i = 0; i < taskDomRefs.current[listIndex].length; i++){
            const taskDomRect = taskDomRefs.current[listIndex][i].getBoundingClientRect();
            if(i === 0 && event.pageY <= taskDomRect.top && i != tIdx){
                const updatedTaskLists = [...taskLists];
                const dragElement = updatedTaskLists[draggedElement.lIndex].tasks.splice(draggedElement.tIndex, 1)[0];
                const destinationIndex = i;
                updatedTaskLists[listIndex].tasks.splice(destinationIndex, 0, dragElement);

                setBoards((state) => {
                    let newState = [...state];
                    newState[boardIndex].taskLists = updatedTaskLists;
                    return newState;
                });
                break;
            }

            if(i !== 0){
                const prevTaskDomRect = taskDomRefs.current[listIndex][i-1].getBoundingClientRect();
                if(event.pageY >= prevTaskDomRect.top && event.pageY <= taskDomRect.top && i != tIdx){
                    const updatedTaskLists = [...taskLists];
                    const dragElement = updatedTaskLists[draggedElement.lIndex].tasks.splice(draggedElement.tIndex, 1)[0];
                    const destinationIndex = draggedElement.tIndex < i ? i - 1 : i;
                    updatedTaskLists[listIndex].tasks.splice(destinationIndex, 0, dragElement);

                    setBoards((state) => {
                        let newState = [...state];
                        newState[boardIndex].taskLists = updatedTaskLists;
                        return newState;
                    });
                    break;
                }
            }

            if(i === taskLists[listIndex].tasks.length-1 && event.pageY >= taskDomRect.top){
                const updatedTaskLists = [...taskLists];
                const dragElement = updatedTaskLists[draggedElement.lIndex].tasks.splice(draggedElement.tIndex, 1)[0];
                const destinationIndex = i + 1 ;
                updatedTaskLists[listIndex].tasks.splice(destinationIndex, 0, dragElement);

                setBoards((state) => {
                    let newState = [...state];
                    newState[boardIndex].taskLists = updatedTaskLists;
                    return newState;
                });
                break;
            }
        }
        setTargetedTaskIndex(null)
        setIsTaskDrag(false);
        setDraggedElement(null);
        setTaskDragStyle({});
    }

    return (
        <div
            draggable="true"
            ref = {(el) => listDomRefs.current[lIdx] = el}
            onDrag={
                function(event){
                    return handleListDrag(event);
                }
            }
            onDragEnd={
                function(event){
                    return handleListDragEnd(event)
                }
            }
            className="list"
            style={isListDrag ? dragStyle : {}}
        >
            <input
                type="text"
                onChange={
                    function(event){
                        return handleListTitleChange(event, lIdx)
                    }
                }
                className="list-title-input"
                value={todo.title}
                placeholder="Enter List Name"
            />
            <div className="task-container">
                {
                    todo.tasks.map((_, tIdx) =>
                        <Fragment key={tIdx}>
                            {
                                targetedTaskIndex?.lIndex === lIdx && targetedTaskIndex?.tIndex === tIdx ?
                                    <div className="task-card" style={{minHeight:"48px", backgroundColor:"gray"}}></div>
                                    :<></>
                            }
                            <div
                                draggable="true"
                                ref={(el) => {
                                    if(tIdx === 0){
                                        taskDomRefs.current[lIdx]=[];
                                    }
                                    taskDomRefs.current[lIdx][tIdx] = el;
                                }}
                                onDrag={
                                    function(event){
                                        return handleTaskDrag(event, tIdx);
                                    }
                                }
                                onDragEnd={
                                    function(event){
                                        return handleTaskDragEnd(event, tIdx)
                                    }
                                }
                                className="task-card"
                                style={isTaskDrag && draggedElement.lIndex === lIdx && draggedElement.tIndex === tIdx ? taskDragStyle : {}}
                            >
                                <input
                                    onChange={
                                        function(event){
                                            return handleTaskChange(event, tIdx)
                                        }
                                    }
                                    type="text"
                                    className="task-input" placeholder="Enter Task Name"
                                    value={todo.tasks[tIdx].title}
                                />
                                <div
                                    onClick={
                                        function(){
                                            return openTaskModal(lIdx, tIdx);
                                        }
                                    }
                                    className="icon-btn"
                                >
                                  <FaEye/>
                                </div>
                            </div>
                        </Fragment>
                    )
                }
                {
                    targetedTaskIndex?.lIndex === lIdx && targetedTaskIndex?.tIndex === todo.tasks.length ?
                        <div className="task-card" style={{minHeight:"48px", backgroundColor:"gray"}}></div>
                        :<></>
                }
            </div>
            <button onClick={handleAddTask} className="todo-btn add-task-btn">
                <FaPlus/>
                New Task
            </button>
        </div>
    )
}

export default TodoList;