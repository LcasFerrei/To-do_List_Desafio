import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks }){
    return(
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </ul>
    )
}

export default TaskList