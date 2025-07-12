import React from "react";

function TaskItem({ task}) {
    return(
        <li className={`task-item ${task.status === 'concluída' ? 'completed' : ''}`}>
            <div className="task-details">
                <h3>{task.title}</h3>
                <p>{task.descripption}</p>
            </div>
            <div className="task-actions">
                <button className="btn-completa">Concluir</button>
                <button className="btn-delete">Excluir</button>
            </div>
        </li>
    )
}

export default TaskItem;