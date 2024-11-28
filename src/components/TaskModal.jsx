/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { FaRegCreditCard } from "react-icons/fa";
import Checklist from "./Checklist.jsx";
import Comments from "./Comments.jsx";
import Description from "./Description.jsx";

function TaskModal({task, selectedTask, setSelectedTask, taskLists, setBoards, boardIndex}){
    function closeTaskModal(){
        setSelectedTask(null)
    }

    function handleTaskModalTitleChange(e){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].title = e.target.value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleAddChecklist(){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].checklists.push({name:"Checklist", items:[]});
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });

    }

    return(
        <div id="task_modal" className="task-modal">
            <div className="task-modal-content">
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
                    <Description
                        task={task}
                        taskLists={taskLists}
                        selectedTask={selectedTask}
                        boardIndex={boardIndex}
                        setBoards={setBoards}
                    />
                    <Checklist
                        selectedTask={selectedTask}
                        taskLists={taskLists}
                        setBoards={setBoards}
                        boardIndex={boardIndex}
                    />
                    <Comments
                        selectedTask={selectedTask}
                        taskLists={taskLists}
                        boardIndex={boardIndex}
                        setBoards={setBoards}
                    />
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