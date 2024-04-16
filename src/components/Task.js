import React from "react";

const Task = ({ task, handleTaskDelete }) => {
  return (
    <div className="task">
      <span className="task-content">{task.content}</span>
      <button onClick={() => handleTaskDelete(task.id)}>❌</button>
    </div>
  );
};

export default Task;
