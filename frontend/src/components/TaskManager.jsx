import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, toggleTaskCompletion } from '../api/api';
import { showAlert } from '../utils/telegram';

const TaskManager = ({ projectId }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks(projectId);
        console.log('TaskManager: Loaded tasks:', tasksData);
        setTasks(tasksData);
      } catch (error) {
        console.error('TaskManager: Error loading tasks:', error);
        showAlert(`Failed to load tasks: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [projectId]);

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleTaskCompletion(taskId);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      console.log('TaskManager: Task updated:', updatedTask);
    } catch (error) {
      console.error('TaskManager: Error toggling task:', error);
      showAlert(`Failed to update task: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/project/${projectId}/create-task`)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Task
      </button>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks found. Add one to start!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task._id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                {task.dueDate && (
                  <p className="text-sm text-gray-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleToggleTask(task._id)}
                className={`px-3 py-1 rounded ${task.completed ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;