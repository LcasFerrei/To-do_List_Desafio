import React from 'react';

function TaskItem({ task, onToggleStatus, onDeleteTask, onEdit, isLoading }) {
  
  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('pt-BR', options).replace(' de', '');
  };

  const dueDate = formatDateTime(task.due_date);

  return (
    <li className={`task-item ${task.status === 'concluída' ? 'completed' : ''}`}>
      <div className="task-details">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        {dueDate && (
          <span className="due-date">
            Previsto para: {dueDate}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(task)}
          disabled={isLoading}
        >
          Editar
        </button>
        <button
          className="btn-complete"
          onClick={() => onToggleStatus(task.id, task.status)}
          disabled={isLoading}
        >
          {task.status === 'pendente' ? 'Concluir' : 'Reabrir'}
        </button>
        <button
          className="btn-delete"
          onClick={() => onDeleteTask(task.id)}
          disabled={isLoading}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
