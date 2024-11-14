/* eslint-disable react/prop-types */
function Sidebar({todoData,setTodoData,setBoardIndex}) {
    function handleAddBoard(){
        const updatedTodoData = [...todoData];
        updatedTodoData.push({title:"", lists:[]});
        setTodoData(updatedTodoData);
    }
console.log("data", todoData)
    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <span>Your boards</span>
                <button onClick={handleAddBoard} className="add-board-btn">+Add Board</button>
            </div>
           <div>
               {todoData.map((board, index) => (
                   <div onClick={() => setBoardIndex(index)} key={index} className="sidebar-manu">
                       {board.title}
                        Board name
                   </div>
               ))}
           </div>
        </div>
    )
}

export default Sidebar;