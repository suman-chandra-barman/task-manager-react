/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";

function TodoList({todo, lIdx, listDomRefs,taskDomRefs, todoData, draggedElement, setTodoData, setSelectedTask, setDraggedElement}){
    const [divRect,setDivRect] = useState();
    const [isDrag, setIsDrag] = useState(false);
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
        console.log("drag", event);
        event.stopPropagation();
        if(event.buttons === 1){
            if(!isDrag){
                setIsDrag(true);

                setDraggedElement({
                    element:todo,
                    index:lIdx
                })

                setDivRect(event.target.getBoundingClientRect());
                setNativeOffset({x:event.nativeEvent.offsetX, y:event.nativeEvent.offsetY})
            }

            if(divRect && nativeOffset){
                const offsetX = event.pageX - nativeOffset.x - Math.round(divRect.left);
                const offsetY = event.pageY - nativeOffset.y - Math.round(divRect.top);

                console.log("position", event.pageX, nativeOffset.x, Math.round(divRect.left));

                setDragStyle({
                    transform: `translate(${offsetX + "px"}, ${offsetY + "px"})`,
                });
            }
        }
    }
 
    function handleTaskDrag(event, tIdx){
        console.log("TaskDrag",tIdx, event.target);
        event.stopPropagation();
        if(event.buttons === 1){
            if(!isDrag){
                setIsDrag(true);

                setDraggedElement({
                    element:event.target,
                    index:tIdx
                })

                setDivRect(event.target.getBoundingClientRect());
                setNativeOffset({x:event.nativeEvent.offsetX, y:event.nativeEvent.offsetY})
            }

            if(divRect && nativeOffset){
                const offsetX = event.pageX - nativeOffset.x - Math.round(divRect.left);
                const offsetY = event.pageY - nativeOffset.y - Math.round(divRect.top);

                setTaskDragStyle({
                    transform: `translate(${offsetX + "px"}, ${offsetY + "px"})`,
                });
            }
        }
    }
 
    function handleListDragEnd(event){
        console.log("dragEnd");
        event.stopPropagation();
        for(let i = 0; i< listDomRefs.current.length; i++){
            const domRect = listDomRefs.current[i].getBoundingClientRect();

            if(event.pageX >= domRect.left && event.pageX <= domRect.right && i != lIdx){
                const updatedTodoData = [...todoData];
                const dragElement = updatedTodoData.splice(draggedElement.index, 1)[0];
                updatedTodoData.splice(i, 0, dragElement);
                
                setTodoData(updatedTodoData);
                break;
            }
        }
        setIsDrag(false);
        setDraggedElement(null);
        setDragStyle({});
    }

    function handleTaskDragEnd(event){
        console.log("taskDragEnd");
        event.stopPropagation();
        console.log("taskDomRef", taskDomRefs);
        // for(let i = 0; i< listDomRefs.current.length; i++){
        //     const domRect = listDomRefs.current[i].getBoundingClientRect();

        //     if(event.pageX >= domRect.left && event.pageX <= domRect.right && i != lIdx){
        //         const updatedTodoData = [...todoData];
        //         const dragElement = updatedTodoData.splice(draggedElement.index, 1)[0];
        //         updatedTodoData.splice(i, 0, dragElement);
                
        //         setTodoData(updatedTodoData);
        //         break;
        //     }
        // }
        setIsDrag(false);
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
            className="list-title"
            style={isDrag ? dragStyle : {}}
        >
            <input 
                type="text"
                onChange={
                    function(event){
                        return handleListTitleChange(event, lIdx)
                    }
                } 
                className="list-input"
                value={todo.title} 
                placeholder="Enter List Name"
            />
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
                        style={isDrag && draggedElement.index === tIdx ? taskDragStyle : {}}
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
            <button onClick={handleAddTask} className="todo-btn add-task-btn">+Add New Task</button>
        </div>
    )
}

export default TodoList;