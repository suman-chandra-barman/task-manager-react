/* eslint-disable react/prop-types */
import {Fragment, useState} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaRegCreditCard, FaComment, FaUserCircle } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { MdDelete,MdOutlineDescription  } from "react-icons/md";
import parse from 'html-react-parser';

function TaskModal({task, selectedTask, setSelectedTask, todoData, setTodoData}){
    const [comments,setComments] = useState(null);
    const [showComments,setShowComments] = useState(null);
    const [editableCommentIndex, setEditableCommentIndex] = useState(-1);

    function closeTaskModal(){
        setSelectedTask(null)
    }

    function handleTaskModalTitleChange(e){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].title = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleDescriptionChange(value){
            const updatedTodoData = [...todoData];
            updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].description = value;
            setTodoData(updatedTodoData);

    }

    function handleAddChecklist(){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists.push({name:"Checklist", items:[]});
        setTodoData(updatedTodoData);

    }

    function handleChecklistItem(checklistIdx) {
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items.push({name:"", isChecked:false});
        setTodoData(updatedTodoData);
        console.log(todoData);
    }

    function handleChecklistTitleChange(e,checklistIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].name = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleChecklistItemChange(e,checklistIdx,itemIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items[itemIdx].name = e.target.value;
        setTodoData(updatedTodoData);
    }

    function handleChecklistItemCheckboxStatusChange(e,checklistIdx,itemIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items[itemIdx].isChecked = e.target.checked;
        setTodoData(updatedTodoData);
    }

    function handleDeleteChecklist(checklistIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].checklists.splice(checklistIdx, 1);
        setTodoData(updatedTodoData);
    }

    function handleDeleteChecklistItem(checklistIdx, itemIdx){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items.splice(itemIdx, 1);
        setTodoData(updatedTodoData);
    }

    function handleSaveComments(){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.unshift(comments);
        setTodoData(updatedTodoData);
        setComments(null);
    }

    function handleCancelComments(){
        setComments(null);
        setShowComments(null);
        setEditableCommentIndex(-1);
    }

    function handleDeleteComments(index){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.splice(index, 1)
        setTodoData(updatedTodoData);
    }

    function handleEditComments(index){
        const updatedTodoData = [...todoData];
        updatedTodoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.splice(index, 1, showComments)
        setTodoData(updatedTodoData);
        setEditableCommentIndex(-1);
        setShowComments(null);
    }

    console.log('comments', todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments);

    return(
        <div id="task_modal" className="task-modal">
            <div className="task-modal-content">

                {/*Main Content Section*/}
                <div className="task-modal-left-side">
                    <div className="task-modal-title-container">
                        <FaRegCreditCard size={20} />
                        <input
                            onChange={
                                function (event) {
                                    return handleTaskModalTitleChange(event)
                                }
                            }
                            id="modal_task_title"
                            className="task-modal-input border"
                            type="text"
                            value={task.title}
                            placeholder="Enter task name"
                        />
                    </div>
                    <div className="description-container">
                        <MdOutlineDescription size={20} />
                        <div className='description-content'>
                            <p className="description-title">Description</p>
                            <ReactQuill
                                theme="snow"
                                value={task.description}
                                onChange={handleDescriptionChange}
                                placeholder="Write description here..."
                            />
                        </div>
                    </div>

                    {/*Checklist Section Start*/}
                    <div className="checklist-container">
                    {todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists?.map((checklist, checklistIdx) =>
                        {
                            let itemProgress  = 100 / todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.length * todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.filter(i => i.isChecked).length;
                            if(isNaN(itemProgress)){
                                itemProgress = 0;
                            }
                            return (
                                <div key={checklistIdx}>
                                    <div className="checklist-title-container">
                                        <div>
                                            <GoChecklist size={20} className="checklist-title-icon"/>
                                        </div>
                                        <div className="checklist-title-input-box">
                                            <input
                                                onChange={
                                                    function (event) {
                                                        return handleChecklistTitleChange(event, checklistIdx);
                                                    }
                                                }
                                                type="text"
                                                value={checklist.name}
                                                className="task-modal-input border"
                                                placeholder="Write checklist name"
                                            />
                                            <button onClick={() => handleDeleteChecklist(checklistIdx)} className="checklist-delete-btn">Delete</button>
                                        </div>
                                    </div>
                                    <div className="checklist-item-progress-container">
                                        <span
                                            className="">{Math.round(itemProgress)}%</span>
                                        <progress
                                            className='checklist-item-progress'
                                            value={itemProgress}
                                            max={100}
                                        >
                                        </progress>
                                    </div>
                                    <div className="checklist-item-container">
                                        {
                                            todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists[checklistIdx].items?.map((item, itemIdx) =>
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
                                                            <MdDelete onClick={()=> handleDeleteChecklistItem(checklistIdx,itemIdx)} className="checklist-list-delete-btn" size={30}/>
                                                    </div>
                                                </div>)
                                        }
                                        <button onClick={() => handleChecklistItem(checklistIdx)}
                                                className="add-checklist-item-btn">Add an item
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                     )}
                    </div>
                    {/*Checklist Section End*/}

                    {/*Comments Section Start*/}
                    <div className="comment-container">
                        <div className="comment-title-container">
                            <div>
                                <FaComment size={20}/>
                            </div>
                            <div className="comment-title">
                                <p>Comments</p>
                            </div>
                        </div>
                        <div className="comment-input-container">
                            <div>
                                <FaUserCircle size={20}/>
                            </div>
                            <div className="comment-input">
                                <ReactQuill
                                    theme="snow"
                                    value={comments}
                                    onChange={setComments}
                                    placeholder="Write a comment..."
                                />
                                <div className="comment-input-btn-container">
                                    <button type="button" onClick={handleSaveComments} className="comment-save-btn" disabled={!comments || comments==="<p><br></p>"}>Save</button>
                                    <button  onClick={handleCancelComments} className="comment-cancel-btn">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="show-comments-container">
                        {todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.length ?
                            todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.map((comment,index) =>
                                <Fragment key={index}>
                                    {editableCommentIndex === index ?
                                        <div className="comment-input-container">
                                            <div>
                                                <FaUserCircle size={20}/>
                                            </div>
                                            <div className="comment-input">
                                                <ReactQuill
                                                    theme="snow"
                                                    // value={showComments}
                                                    defaultValue={todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments[index]}
                                                    onChange={setShowComments}
                                                    placeholder="Write a comment..."
                                                />
                                                <div className="comment-input-btn-container">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditComments(index)}
                                                        className="comment-save-btn"
                                                    >
                                                        Save
                                                    </button>
                                                    <button onClick={handleCancelComments}
                                                            className="comment-cancel-btn">Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="show-comments-box">
                                            <FaUserCircle size={20}/>
                                            <div className="show-comments-content">
                                                <div className="comments">
                                                    {parse(todoData[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments[index])}
                                                </div>
                                                <div className="show-comments-btn-container">
                                                    <span onClick={() => setEditableCommentIndex(index)}
                                                          className="comments-btn">Edit</span>
                                                    <span onClick={() => handleDeleteComments(index)}
                                                          className="comments-btn">Delete</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Fragment>
                            ) : <></>
                        }
                    </div>
                    {/*Comments Section End*/}
                </div>

                {/* Sidebar Section*/}
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