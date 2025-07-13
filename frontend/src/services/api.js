import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001' 
});

export const getTasks = () => api.get('/tasks'); //Buscar todas as tarefas
export const addTask = (taskData) => api.post('/tasks', taskData); // Adicionar uma nova tarefa
export const updateTask = (taskId, updateData) => api.put(`/tasks/${taskId}`, updateData); // Atualizar uma tarefa existente
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`); //Remover uma tarefa