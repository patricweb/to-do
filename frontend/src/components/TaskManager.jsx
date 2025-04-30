import { useState, useEffect } from 'react';
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import { showAlert } from '../utils/telegram';
import axios from 'axios';

const TaskManager = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/tasks`, {
        headers: {
          'x-telegram-init-data': window.Telegram.WebApp.initData
        }
      });
      setTasks(response.data);
    } catch (error) {
      showAlert('Error fetching tasks: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/projects/${projectId}/tasks`, newTask, {
        headers: {
          'x-telegram-init-data': window.Telegram.WebApp.initData
        }
      });
      setTasks([...tasks, response.data]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      showAlert('Task created successfully!');
    } catch (error) {
      showAlert('Error creating task: ' + error.message);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const response = await axios.patch(`/api/tasks/${taskId}`, {
        completed: !task.completed
      }, {
        headers: {
          'x-telegram-init-data': window.Telegram.WebApp.initData
        }
      });
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (error) {
      showAlert('Error updating task: ' + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      
      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <MainButton
          text="Create Task"
          onClick={handleCreateTask}
        />
      </form>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task._id}
            className={`border rounded p-4 ${task.completed ? 'bg-gray-50' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
                <div className="mt-2 text-sm">
                  <span className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.dueDate && (
                    <span className="ml-4 text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggleComplete(task._id)}
                className={`px-3 py-1 rounded ${
                  task.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {task.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager; 