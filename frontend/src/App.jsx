import { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm'; 
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

//Função de Adicionar uma nova tarefa
  const handleAddTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:3001/tasks', taskData);
      setTasks(prevTasks => [response.data.data, ...prevTasks]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
      toast.error('Não foi possível adicionar a tarefa.');   
     }
  };

  //Função de salvar tarefa editada
  const handleUpdateTask = async (taskData) => {
    if(!editingTask) return;
    try {
      const response = await axios.put(`http://localhost:3001/tasks/${editingTask.id}`, {
        ...editingTask, // Envia os dados antigos...
        ...taskData      // ...sobrescreve com os novos (title, description)
      });

      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === editingTask.id ? response.data.data : task))
      );
      toast.success('Tarefa atualizada com sucesso!');
      setIsEditModalOpen(false); // Fecha o modal
      setEditingTask(null);
    }catch (error){
      console.error("Erro ao atualizar tarefa:", error);
      toast.error('Não foi possivel atualziar a tarefa')
    }
  }

  // Função Atualizar o status
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pendente' ? 'concluída' : 'pendente';
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (!taskToUpdate) {
      toast.error("Tarefa não encontrada!");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/tasks/${taskId}`, {
        ...taskToUpdate,   
        status: newStatus 
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success('Status da tarefa atualizado!');

    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error('Não foi possível atualizar o status da tarefa.');
    }
  };

  //Função Delete
  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskToDelete}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      toast.success('Boa! Mais um passo dado em direção aos seus objetivos!');

    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
      toast.error('Não foi possível remover a tarefa.');
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  }

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <h1>Minha Lista de Tarefas</h1>
      
      <TaskForm onSave={handleAddTask} buttonText="Adicionar Tarefa" />
      
      <TaskList
        tasks={tasks}
        onToggleStatus={handleToggleTaskStatus}
        onDeleteTask={openDeleteModal}
        onEdit={openEditModal} 
      />
      
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        message="Tem certeza que deseja excluir esta tarefa?"
      />

      {editingTask && (
        <ConfirmModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onConfirm={() => {
            document.querySelector('.edit-form-wrapper form').requestSubmit();
          }}
          message={
            <div className="edit-form-wrapper">
              <h2>Editar Tarefa</h2>
              <TaskForm
                onSave={handleUpdateTask}
                initialData={editingTask}
                buttonText="Salvar Alterações"
              />
            </div>
          }
        />
      )}
    </div>
  );
}

export default App;