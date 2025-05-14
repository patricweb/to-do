import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskItem from './TaskItem';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const initData = window.Telegram?.WebApp?.initData || '';
        if (!initData) {
          throw new Error('Telegram Web App not initialized');
        }

        // Получаем проект
        const projectResponse = await fetch(`https://to-do-1-ob6b.onrender.com/api/projects/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': initData,
          },
        });

        if (!projectResponse.ok) {
          const errorData = await projectResponse.json();
          throw new Error(errorData.error || 'Failed to fetch project');
        }

        const projectData = await projectResponse.json();
        setProject(projectData);

        // Получаем задачи
        const tasksResponse = await fetch(`https://to-do-1-ob6b.onrender.com/api/projects/${id}/tasks`, {
          headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': initData,
          },
        });

        if (!tasksResponse.ok) {
          const errorData = await tasksResponse.json();
          throw new Error(errorData.error || 'Failed to fetch tasks');
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [id]);

  const handleTaskToggle = async (taskId) => {
    try {
      const initData = window.Telegram?.WebApp?.initData || '';
      if (!initData) {
        throw new Error('Telegram Web App not initialized');
      }

      const response = await fetch(`https://to-do-1-ob6b.onrender.com/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': initData,
        },
        body: JSON.stringify({
          completed: !tasks.find(task => task._id === taskId).completed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const initData = window.Telegram?.WebApp?.initData || '';
      if (!initData) {
        throw new Error('Telegram Web App not initialized');
      }

      const response = await fetch(`https://to-do-1-ob6b.onrender.com/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': initData,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Проект не найден</h3>
        <Link to="/" className="mt-4 btn-primary inline-block">
          Вернуться к проектам
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
          {project.description && (
            <p className="mt-2 text-gray-600">{project.description}</p>
          )}
        </div>
        <Link
          to={`/project/${id}/create-task`}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Новая задача</span>
        </Link>
      </div>

      {project.shareToken && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            Ссылка для доступа: {window.location.origin}/shared/{project.shareToken}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Задачи</h3>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Нет задач</h3>
            <p className="mt-1 text-sm text-gray-500">
              Добавьте первую задачу в проект.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={() => handleTaskToggle(task._id)}
                onDelete={() => handleTaskDelete(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;