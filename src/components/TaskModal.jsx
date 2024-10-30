/* eslint-disable react/prop-types */
function TaskModal({task, selectedTask, setSelectedTask, todoData, setTodoData}){
    function closeTaskModal(){
        setSelectedTask(null)
    }

    function handleTaskModalTitleChange(e){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].title = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleTaskModalDescriptionChange(e){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].description = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleChecklist(){
        
    }

    return(
        <div id="task_modal" className="task-modal">
            <div className="task-modal-content">
                <div className="task-modal-left-side">
                    <input 
                        onChange={
                            function(event){
                                return handleTaskModalTitleChange(event)
                            }
                        } 
                        id="modal_task_title" 
                        className="modal-task-title" 
                        type="text" value={task.title} 
                        placeholder="Enter task name"
                    />
                    <textarea 
                        onChange={
                            function(event){
                                return handleTaskModalDescriptionChange(event)
                            }
                        } 
                        id="modal_task_description" 
                        value={task.description} 
                        rows="4" 
                        placeholder="Enter your task description..."
                    >
                    </textarea>
                </div>
                <div className="task-modal-right-side">
                    <span id="modal_close_btn" onClick={closeTaskModal} className="close">&times;</span>
                    <div>
                        <button onClick={handleChecklist} className="task-modal-btn">Checklist</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TaskModal;