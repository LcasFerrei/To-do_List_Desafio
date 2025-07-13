import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { getTasks, addTask, updateTask, deleteTask } from './services/api';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  //Modo Escuro
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDarkMode]);

  //BUSCA AS TAREFAS DA API 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar as tarefas:", error);
      }
    };
    fetchTasks();
  }, []);

  //FILTRO
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  //Função de Adicionar uma nova tarefa
  const handleAddTask = async (taskData) => {
    try {
      setIsLoading(true);
      const response = await addTask(taskData);
      setTasks(prevTasks => [response.data.data, ...prevTasks]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Não foi possível adicionar a tarefa.';
      toast.error(errorMessage);
      console.error("Erro ao adicionar a tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Função de salvar tarefa editada
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      setIsLoading(true);
      const response = await updateTask(editingTask.id, {
        ...editingTask,
        ...taskData
      });
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === editingTask.id ? response.data.data : task))
      );
      toast.success('Tarefa atualizada com sucesso!');
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Não foi possível atualizar a tarefa.';
      toast.error(errorMessage);
      console.error("Erro ao atualizar tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função Atualizar o status
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pendente' ? 'concluída' : 'pendente';
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (!taskToUpdate) {
      toast.error("Tarefa não encontrada!");
      return;
    }

    try {
      setIsLoading(true);
      await updateTask(taskId, {
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
    } finally {
      setIsLoading(false);
    }
  };

  //Função Delete
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsLoading(true);
      await deleteTask(taskToDelete);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      toast.success('Boa! Mais um passo dado em direção aos seus objetivos!');
    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
      toast.error('Não foi possível remover a tarefa.');
    } finally {
      setIsLoading(false);
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
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="main-layout">
        <main className="main-content">
          <header>
            <h1>Minhas Tarefas</h1>
            <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              <i className={isDarkMode ? 'bx bxs-sun' : 'bx bxs-moon'}></i>
            </button>
          </header>
          <TaskList
            tasks={filteredTasks}
            onToggleStatus={handleToggleTaskStatus}
            onDeleteTask={openDeleteModal}
            onEdit={openEditModal}
            isLoading={isLoading}
          />
        </main>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Pesquisar</h2>
            <input
              type="text"
              placeholder="Pesquisar por título..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sidebar-card">
            <h2>Adicionar Nova Tarefa</h2>
            <TaskForm
              onSave={handleAddTask}
              buttonText="Adicionar Tarefa"
              isLoading={isLoading}
            />
          </div>
        </aside>
      </div>

      {/* Modais ficam fora do grid para sobrepor toda a tela */}
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
            const form = document.querySelector('.edit-form-wrapper form');
            if (form) form.requestSubmit();
          }}
          message={
            <div className="edit-form-wrapper">
              <h2>Editar Tarefa</h2>
              <TaskForm
                onSave={handleUpdateTask}
                initialData={editingTask}
                buttonText="Salvar Alterações"
                isLoading={isLoading}
              />
            </div>
          }
        />
      )}
    </div>
  );
}

export default App;
