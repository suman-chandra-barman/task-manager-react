import "../styles/Checklist.css"
import {MdDelete} from "react-icons/md";
import { GoChecklist } from "react-icons/go";

function Checklist({selectedTask, taskLists, setBoards, boardIndex}) {
    function handleChecklistItem(checklistIdx) {
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items.push({name:"", isChecked:false});
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleChecklistTitleChange(e,checklistIdx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].name = e.target.value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleChecklistItemChange(e,checklistIdx,itemIdx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items[itemIdx].name = e.target.value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleChecklistItemCheckboxStatusChange(e,checklistIdx,itemIdx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items[itemIdx].isChecked = e.target.checked;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleDeleteChecklist(checklistIdx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].checklists.splice(checklistIdx, 1);
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleDeleteChecklistItem(checklistIdx, itemIdx){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items.splice(itemIdx, 1);
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    return (
        <div className="checklist-container">
            {taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists?.map((checklist, checklistIdx) => {
                    let itemProgress = 100 / taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.length * taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.filter(i => i.isChecked).length;
                    if (isNaN(itemProgress)) {
                        itemProgress = 0;
                    }
                    return (
                        <div key={checklistIdx}>
                            <div className="checklist-title-container">
                                <div>
                                    <GoChecklist size={20} className="checklist-title-icon"/>
                                </div>
                                <div className="checklist-list-input-box">
                                    <input
                                        onChange={
                                            function (event) {
                                                return handleChecklistTitleChange(event, checklistIdx);
                                            }
                                        }
                                        type="text"
                                        value={checklist.name}
                                        className="task-modal-input"
                                        placeholder="Write checklist name"
                                    />
                                    <div onClick={() => handleDeleteChecklist(checklistIdx)} className="icon-btn checklist-list-delete-btn">
                                        < MdDelete size={20}/>
                                    </div>
                                </div>
                            </div>
                            <div className="checklist-item-progress-container">
                                <span className="">{Math.round(itemProgress)}%</span>
                                <progress
                                    className='checklist-item-progress'
                                    value={itemProgress}
                                    max={100}
                                >
                                </progress>
                            </div>
                            <div className="checklist-item-container">
                                {taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.map((item, itemIdx) =>
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
                                        <div className="checklist-list-input-box">
                                            <input
                                                onChange={
                                                    function (event) {
                                                        return handleChecklistItemChange(event, checklistIdx, itemIdx);
                                                    }
                                                }
                                                type="text"
                                                value={item.name}
                                                className="task-modal-input hover-effect"
                                                placeholder="Write something..."
                                            />
                                            <div onClick={() => handleDeleteChecklistItem(checklistIdx, itemIdx)}
                                                 className="icon-btn checklist-list-delete-btn">
                                                <MdDelete size={20}/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button onClick={() => handleChecklistItem(checklistIdx)}
                                        className="add-checklist-item-btn">Add an item
                                </button>
                            </div>
                        </div>
                    )
                }
            )}
        </div>
    )
}
export default Checklist