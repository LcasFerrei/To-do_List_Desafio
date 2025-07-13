import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleStatus, onDeleteTask, onEdit }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDeleteTask={onDeleteTask}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TaskList;