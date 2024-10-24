/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";

function TodoList({todo, lIdx, listDomRefs,taskDomRefs, todoData, draggedElement, setTodoData, setSelectedTask, setDraggedElement, setTargetedListIndex}){
    const [divRect,setDivRect] = useState();
    const [isListDrag, setIsListDrag] = useState(false);
    const [isTaskDrag, setIsTaskDrag] = useState(false);
    const [dragStyle, setDragStyle] = useState({});
    const [taskDragStyle, setTaskDragStyle] = useState({});
    const [nativeOffset, setNativeOffset] = useState();

    function handleAddTask(){
        const updatedTodoData = [...todoData];
        updatedTodoData[lIdx].tasks.push({title:"", description:""});
        setTodoData(updatedTodoData)
    }

    function handleListTitleChange (e,idx){
        const updatedTodoData = [...todoData];
        updatedTodoData[idx].title = e.target.value;
        setTodoData(updatedTodoData); 
    }

    function handleTaskChange(e,idx){
        const updatedTodoData = [...todoData];
        updatedTodoData[lIdx].tasks[idx].title = e.target.value;
        setTodoData(updatedTodoData);
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

                for(let i = 0; i< listDomRefs.current.length; i++){
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
                   
                    if(i === todoData.length-1 && event.pageX >= listDomRect.left && i != lIdx){
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
            }
        }
    }
 
    function handleListDragEnd(event){
        event.stopPropagation();
        for(let i = 0; i< listDomRefs.current.length; i++){
            const listDomRect = listDomRefs.current[i].getBoundingClientRect();

            if(i === 0 && event.pageX <= listDomRect.left && i != lIdx){
                const updatedTodoData = [...todoData];
                const dragElement = updatedTodoData.splice(draggedElement.index, 1)[0];
                const destinationIndex = draggedElement.index < i ? i-1 : i;
                updatedTodoData.splice(destinationIndex, 0, dragElement);
                
                setTodoData(updatedTodoData);
                break;
            }

           if(i !== 0){
                const prevListDomRect = listDomRefs.current[i-1].getBoundingClientRect();
                if(event.pageX >= prevListDomRect.left && event.pageX <= listDomRect.left && i != lIdx){
                    const updatedTodoData = [...todoData];
                    const dragElement = updatedTodoData.splice(draggedElement.index, 1)[0];
                    const destinationIndex = draggedElement.index < i ? i-1 : i;
                    updatedTodoData.splice(destinationIndex, 0, dragElement);
                    
                    setTodoData(updatedTodoData);
                    break;
                }
           }

            if(i === todoData.length-1 && event.pageX >= listDomRect.left && i != lIdx){
                const updatedTodoData = [...todoData];
                const dragElement = updatedTodoData.splice(draggedElement.index, 1)[0];
                const destinationIndex = i;

                updatedTodoData.splice(destinationIndex, 0, dragElement);
                
                setTodoData(updatedTodoData);
                break;
            }
        }
        setTargetedListIndex(null);
        setIsListDrag(false);
        setDraggedElement(null);
        setDragStyle({});
    }

    function handleTaskDragEnd(event){
        event.stopPropagation();

        for(let listIndex = 0; listIndex < taskDomRefs.current.length; listIndex++){
            for(let taskIndex = 0; taskIndex <taskDomRefs.current[listIndex].length; taskIndex++){
                const taskDomRect = taskDomRefs.current[listIndex][taskIndex].getBoundingClientRect();

                if(event.pageX >= taskDomRect.left && event.pageX <= taskDomRect.right && event.pageY >= taskDomRect.top && event.pageY <= taskDomRect.bottom && !(listIndex == draggedElement.lIndex && taskIndex == draggedElement.tIndex)){
                    const updatedTodoData = [...todoData];
    
                    const dragElement = updatedTodoData[draggedElement.lIndex].tasks.splice(draggedElement.tIndex, 1)[0];
                    updatedTodoData[listIndex].tasks.splice(taskIndex, 0, dragElement);
                    
                    setTodoData(updatedTodoData);
                    break;
                }
                
            }
        }

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
                    todo.tasks.map(function(_, tIdx){
                        return (
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
                                    return handleTaskDragEnd(event)
                                }
                            } 
                            key={tIdx} 
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
                            <button 
                                onClick={
                                    function(){
                                        return openTaskModal(lIdx, tIdx);
                                    }
                                } 
                                className="task-details-btn"
                            >
                                Details
                            </button>
                        </div>
                        )
                    })
                }
            </div>
            <button onClick={handleAddTask} className="todo-btn add-task-btn">+Add New Task</button>
        </div>
    )
}

export default TodoList;