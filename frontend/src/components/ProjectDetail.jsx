import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjects, fetchTasks, toggleTaskCompletion } from '../api/api';
import { showAlert } from '../utils/telegram';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          fetchProjects().then(projects => projects.find(p => p._id === id)),
          fetchTasks(id)
        ]);
        console.log('ProjectDetail: Loaded project:', projectData);
        console.log('ProjectDetail: Loaded tasks:', tasksData);
        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error('ProjectDetail: Error loading data:', error);
        showAlert(`Failed to load project or tasks: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleTaskCompletion(taskId);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      console.log('ProjectDetail: Task updated:', updatedTask);
    } catch (error) {
      console.error('ProjectDetail: Error toggling task:', error);
      showAlert(`Failed to update task: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center">Project not found</div>;
  }

  return (
    <div>
      <BackButton onClick={() => window.history.back()} />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{project.title}</h2>
        {project.description && (
          <p className="text-gray-600 mb-4">{project.description}</p>
        )}
        <Link
          to={`/project/${id}/create-task`}
          className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </Link>
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
    </div>
  );
};

export default ProjectDetail;