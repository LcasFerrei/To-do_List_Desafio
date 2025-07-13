import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function TaskForm({ onSave, initialData = null, buttonText = "Adicionar", isLoading}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    if(initialData){
      setTitle(initialData.title);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error('Por favor, insira um título para a tarefa.');
      return;
    }

    onSave({title, description})

    if (!initialData){
      setTitle('');
      setDescription('');
    }
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : buttonText}
      </button>
    </form>
  );
}

export default TaskForm;