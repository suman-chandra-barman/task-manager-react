import "../styles/Description.css";
import {MdOutlineDescription} from "react-icons/md";
import ReactQuill from "react-quill";

function Description({task, selectedTask, taskLists, setBoards, boardIndex}) {
    function handleDescriptionChange(value){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].description = value;
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });

    }

    return (
        <div className="description-container">
            <MdOutlineDescription size={20}/>
            <div className='description-content'>
                <h4 className="description-title">Description</h4>
                <ReactQuill
                    theme="snow"
                    value={task.description}
                    onChange={handleDescriptionChange}
                    placeholder="Write description here..."
                />
            </div>
        </div>
    )
}

export default Description;