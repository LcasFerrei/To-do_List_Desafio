import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleStatus, onDeleteTask, onEdit, isLoading }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa por aqui. Que tal adicionar uma?</p>;
  }
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDeleteTask={onDeleteTask}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}

export default TaskList;