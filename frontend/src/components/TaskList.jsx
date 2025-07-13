import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleStatus, onDeleteTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;