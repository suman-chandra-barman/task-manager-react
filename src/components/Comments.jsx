import "../styles/Comments.css";
import {FaComment, FaUserCircle} from "react-icons/fa";
import ReactQuill from "react-quill";
import {Fragment, useState} from "react";
import parse from "html-react-parser";

function Comments({ selectedTask, taskLists, setBoards, boardIndex }) {
    const [comments,setComments] = useState(null);
    const [showComments,setShowComments] = useState(null);
    const [editableCommentIndex, setEditableCommentIndex] = useState(-1);

    function handleSaveComments(){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.unshift(comments);
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
        setComments(null);
    }

    function handleCancelComments(){
        setComments(null);
        setShowComments(null);
        setEditableCommentIndex(-1);
    }

    function handleDeleteComments(index){
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.splice(index, 1)
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
    }

    function handleEditComments(index) {
        const updatedTaskLists = [...taskLists];
        updatedTaskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.splice(index, 1, showComments)
        setBoards((state) => {
            let newState = [...state];
            newState[boardIndex].taskLists = updatedTaskLists;
            return newState;
        });
        setEditableCommentIndex(-1);
        setShowComments(null);
    }

    return (
        <>
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
                            <button type="button" onClick={handleSaveComments} className="comment-save-btn"
                                    disabled={!comments || comments === "<p><br></p>"}>Save
                            </button>
                            <button onClick={handleCancelComments} className="comment-cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="show-comments-container">
                {taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.length ?
                    taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments.map((comment, index) =>
                        <div key={index}>
                            {editableCommentIndex === index ?
                                <div className="comment-input-container">
                                    <div>
                                        <FaUserCircle size={20}/>
                                    </div>
                                    <div className="comment-input">
                                        <ReactQuill
                                            theme="snow"
                                            // value={showComments}
                                            defaultValue={taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments[index]}
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
                                :
                                <div className="show-comments-box">
                                    <FaUserCircle size={20}/>
                                    <div className="show-comments-content">
                                        <div className="comments">
                                            {parse(taskLists[selectedTask.listIndex].tasks[selectedTask.taskIndex].comments[index])}
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
                        </div>
                    ) : <></>
                }
            </div>
        </>
    )
}

export default Comments;