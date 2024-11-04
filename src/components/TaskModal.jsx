/* eslint-disable react/prop-types */
import { GoChecklist } from "react-icons/go";

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

    function handleAddChecklist(){
        const updatedChecklist = [...todoData];
        updatedChecklist[selectedTask.listIndex].checklists.push({name:"Checklist", items:[]});
        setTodoData(updatedChecklist);

    }

    function handleChecklistItem(checklistIdx) {
        const updatedChecklist = [...todoData];
        updatedChecklist[selectedTask.listIndex].checklists[checklistIdx].items.push({name:"", isChecked:false});
        setTodoData(updatedChecklist);
        console.log(todoData);
    }

    function handleChecklistTitleChange(e,checklistIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].checklists[checklistIdx].name = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleChecklistItemChange(e,checklistIdx,itemIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].checklists[checklistIdx].items[itemIdx].name = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleChecklistItemCheckboxStatusChange(e,checklistIdx,itemIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].checklists[checklistIdx].items[itemIdx].isChecked = e.target.checked;
        setTodoData(updatedTodoData);
    }

    console.log('data', todoData);
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
                        className="task-modal-input focus-effect"
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
                        className="task-modal-input hover-effect"
                        value={task.description} 
                        rows="4" 
                        placeholder="Enter your task description..."
                    >
                    </textarea>
                    <div className="checklist-container">
                        {
                            todoData[selectedTask.listIndex].checklists?.map((checklist, checklistIdx) =>
                                {
                                    let itemProgress  = 100 / todoData[selectedTask.listIndex].checklists[checklistIdx].items.length * todoData[selectedTask.listIndex].checklists[checklistIdx].items.filter(i => i.isChecked).length;
                                    if(isNaN(itemProgress)){
                                        itemProgress = 0;
                                    }
                                    return (
                                        <div key={checklistIdx}>
                                            <div className="checklist-title-container">
                                                <GoChecklist className="checklist-title-icon"/>
                                                <input
                                                    onChange={
                                                        function (event) {
                                                            return handleChecklistTitleChange(event, checklistIdx);
                                                        }
                                                    }
                                                    type="text"
                                                    value={checklist.name}
                                                    className="task-modal-input focus-effect"/>
                                            </div>
                                            <div className="checklist-item-progress-container">
                                                <span
                                                    className="">{itemProgress}%</span>
                                                <progress
                                                    className='checklist-item-progress'
                                                    value={itemProgress}
                                                    max={100}
                                                >
                                                </progress>
                                            </div>
                                            <div className="checklist-item-container">
                                                {
                                                    todoData[selectedTask.listIndex].checklists[checklistIdx].items?.map((item, itemIdx) =>
                                                        <div key={itemIdx} className="checklist-item">
                                                            <input
                                                                onChange={
                                                                    function (event) {
                                                                        return handleChecklistItemCheckboxStatusChange(event, checklistIdx, itemIdx);
                                                                    }
                                                                }
                                                                type="checkbox"
                                                                className="checklist-item-checkbox task-modal-input"
                                                                checked={item.isChecked}
                                                            />
                                                            <input
                                                                onChange={
                                                                    function (event) {
                                                                        return handleChecklistItemChange(event, checklistIdx, itemIdx);
                                                                    }
                                                                }
                                                                type="text"
                                                                value={item.name}
                                                                className="task-modal-input hover-effect"
                                                            />
                                                        </div>)
                                                }
                                                <button onClick={() => handleChecklistItem(checklistIdx)}
                                                        className="add-checklist-item-btn">Add an item
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
                <div className="task-modal-right-side">
                    <span id="modal_close_btn" onClick={closeTaskModal} className="close">&times;</span>
                    <div>
                        <button onClick={handleAddChecklist} className="task-modal-btn">Checklist</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal;