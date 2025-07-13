import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function TaskForm({ onSave, initialData = null, buttonText = "Adicionar Tarefa", isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      
      try {
        if (initialData.due_date) {
          const date = new Date(initialData.due_date);
          
          if (!isNaN(date.getTime())) {
            const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
            setDueDate(localDate.toISOString().slice(0, 16));
          } else {
            setDueDate('');
          }
        } else {
          setDueDate('');
        }
      } catch (error) {
        console.error("Erro ao processar a data inicial:", error);
        setDueDate('');
      }
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('Por favor, insira um título para a tarefa.');
      return;
    }
    
    if (dueDate) {
      const year = new Date(dueDate).getFullYear();
      if (year > 9999) {
        toast.error('O ano inserido é inválido. Por favor, corrija.');
        return;
      }
    }

    onSave({ title, description, due_date: dueDate || null });

    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      const yearString = value.substring(0, 4);
      if (yearString.length === 4 && parseInt(yearString, 10) > 9999) {
         toast.error('O ano não pode ser maior que 9999.');
         return; 
      }
    }
    setDueDate(value);
  };


  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="form-input"
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="form-input"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
      />
      <input
        className="form-input"
        type="datetime-local"
        value={dueDate}
        onChange={handleDateChange}
        max="9999-12-31T23:59"
      />
      <button className="form-button" type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : buttonText}
      </button>
    </form>
  );
}

export default TaskForm;