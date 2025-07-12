import React, { useState } from 'react';
import toast from 'react-hot-toast';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error('Por favor, insira um título para a tarefa.');
      return;
    }

    onAddTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
}

export default TaskForm;