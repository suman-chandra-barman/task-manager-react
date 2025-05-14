import "../styles/Sidebar.css"
import {FaPlus, FaAngleLeft, FaAngleRight, FaTrash} from "react-icons/fa";
import {useState} from "react";
import { RxCross2 } from "react-icons/rx";

function Sidebar({boards,boardIndex,setBoards,setBoardIndex, isCollapsed, setIsCollapsed}) {
    const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
    const [boardName, setBoardName] = useState("");

    function handleAddBoard(){
        if(boardName){
            const updatedBoards = [...boards];
            updatedBoards.push({title:boardName, taskLists:[]});
            setBoards(updatedBoards);
            setIsAddBoardModalOpen(false);
        }
    }
    function handleCancelBoard(){
        setBoardName("");
        setIsAddBoardModalOpen(false);
    }
    function handleDeleteBoard(index){
        let confirmed = confirm("Are you sure want to delete?");
        if(confirmed){
            const updatedBoards = [...boards];
            updatedBoards.splice(index,1);
            setBoards(updatedBoards);
        }
    }

    return (
        <>
            <div className={`${isCollapsed ? "collapsed" : "sidebar-container"}`}>
                {!isCollapsed ?
                    <div>
                        <div className="sidebar-header">
                            <span>Task Manager</span>
                            <div title="Collapse sidebar" onClick={() => setIsCollapsed(true)} className="icon-btn">
                               <FaAngleLeft/>
                            </div>
                        </div>
                        <div className="sidebar-title">
                            <span>Your boards</span>
                            <div title="Add New Board" onClick={() => setIsAddBoardModalOpen(!isAddBoardModalOpen)} className="icon-btn">
                                <FaPlus/>
                            </div>
                            {isAddBoardModalOpen &&
                                <div className="add-board-container">
                                    <div className="add-board-title-container">
                                        <h3 className="add-board-title">Add board</h3>
                                        <RxCross2 onClick={handleCancelBoard} size={20}className="add-board-close-btn"/>
                                    </div>
                                    <label htmlFor="add_board">Title</label> <br/>
                                    <input onChange={(e) => setBoardName(e.target.value)} id="add_board" type="text"
                                           placeholder="Enter board name" className="add-board-input"/>
                                    <div className="add-board-btns">
                                        <button onClick={handleAddBoard} className="add-board-save-btn">Save</button>
                                        <button onClick={handleCancelBoard} className="comment-cancel-btn">Cancel
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            <div>
                                {boards.map((board, index) => (
                                    <div
                                        onClick={() => setBoardIndex(index)}
                                        key={index}
                                        className={`sidebar-manu ${boardIndex === index ? "active-sidebar-manu" : ""}`}
                                    >
                                        {board.title}
                                        <div title="Delete board" onClick={() => handleDeleteBoard(index)} className="icon-btn">
                                            <FaTrash/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    :
                    <div title="Expand sidebar" onClick={() => setIsCollapsed(false)} className="sidebar-expand">
                       <button  className="sidebar-expand-btn">
                           <FaAngleRight size={20}/>
                       </button>
                    </div>

                }
            </div>
        </>
    )
}

export default Sidebar;