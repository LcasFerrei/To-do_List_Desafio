import { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';

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


  return(
    <div className="container">
      <h1>Minha Lista de Tarefas</h1>
      <TaskList tasks={tasks}/>
    </div>
  )
}

export default App
