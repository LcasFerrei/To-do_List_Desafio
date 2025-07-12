import { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm'; 

function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try{
        const response = await axios.get('http://localhost:3001/tasks');
        setTasks(response.data.data);
      }catch (error){
        console.error("Error ao buscar as taresfas:", error);
      }
    }

    fetchTasks();
  }, []);


  const handleAddTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:3001/tasks', taskData);
      setTasks(prevTasks => [response.data.data, ...prevTasks]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
      toast.error('Não foi possível adicionar a tarefa.');    }
  };

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <h1>Minha Lista de Tarefas</h1>
      <TaskForm onAddTask={handleAddTask} /> 
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;