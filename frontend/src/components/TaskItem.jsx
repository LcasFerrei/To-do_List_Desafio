import React from "react";

function TaskItem({ task, onToggleStatus, onDeleteTask}) {
    return (
      <li className={`task-item ${task.status === 'concluída' ? 'completed' : ''}`}>
        <div className="task-details">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
        <div className="task-actions">
          <button
            className="btn-complete"
            onClick={() => onToggleStatus(task.id, task.status)}
          >
            {task.status === 'pendente' ? 'Concluir' : 'Reabrir'}
          </button>
          <button className="btn-delete"
          onClick={() => onDeleteTask(task.id)}
          >
            Excluir
          </button>
        </div>
      </li>
    );
  }
  
  export default TaskItem;