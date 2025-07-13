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
  const [filterStatus, setFilterStatus] = useState('todas'); 
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  //Modo Escuro
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDarkMode]);

  //Busca as tarefas da api
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

  //Lógica de ordenação e filtragem
  const formatDateTimeForSearch = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  const processedTasks = tasks
    .filter(task => {
      if (filterStatus === 'pendentes') return task.status === 'pendente';
      if (filterStatus === 'concluidas') return task.status === 'concluída';
      return true;
    })
    .filter(task => {
      const searchTerm = searchQuery.toLowerCase();
      const taskDate = formatDateTimeForSearch(task.due_date).toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm)) ||
        taskDate.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (a.status === 'concluída' && b.status !== 'concluída') return 1;
      if (a.status !== 'concluída' && b.status === 'concluída') return -1;
      return 0; 
    });

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

  //FUnções de controle dos modais
  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="main-layout">
      {/* Coluna Principal */}
      <div className="main-content">
        <Toaster position="top-center" reverseOrder={false} />
        <header>
          <h1>Minhas Tarefas</h1>
          <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            <i className={isDarkMode ? 'bx bxs-sun' : 'bx bxs-moon'}></i>
          </button>
        </header>

        {/* Controles de Filtro */}
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filterStatus === 'todas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('todas')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pendentes' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pendentes')}
          >
            Pendentes
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'concluidas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('concluidas')}
          >
            Concluídas
          </button>
        </div>

        <TaskList
          tasks={processedTasks} 
          onToggleStatus={handleToggleTaskStatus}
          onDeleteTask={openDeleteModal}
          onEdit={openEditModal}
          isLoading={isLoading}
        />
      </div>

      {/* Coluna Lateral */}
      <aside className="sidebar">
        <div className="sidebar-card">
          <h2>Pesquisar</h2>
          <input
            type="text"
            placeholder="Buscar por título, descrição ou data..."
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

      {/* Modais */}
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
