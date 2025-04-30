import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import { showAlert } from '../utils/telegram';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const headers = {};
      // Only add Telegram init data if we're in Telegram WebApp
      if (window.Telegram?.WebApp?.initData) {
        headers['x-telegram-init-data'] = window.Telegram.WebApp.initData;
      }
      
      const response = await axios.get('/api/projects', { headers });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Only show alert if we're in Telegram WebApp
      if (window.Telegram?.WebApp) {
        showAlert('Error fetching projects: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const headers = {};
      if (window.Telegram?.WebApp?.initData) {
        headers['x-telegram-init-data'] = window.Telegram.WebApp.initData;
      }
      
      await axios.delete(`/api/projects/${projectId}`, { headers });
      setProjects(projects.filter(project => project._id !== projectId));
      if (window.Telegram?.WebApp) {
        showAlert('Project deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      if (window.Telegram?.WebApp) {
        showAlert('Error deleting project: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Projects</h2>
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/projects/${project._id}/tasks`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Tasks
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            {project.shareToken && (
              <div className="mt-2 text-sm text-gray-500">
                Share link: {window.location.origin}/shared/{project.shareToken}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {window.Telegram?.WebApp ? (
          <MainButton
            text="Create New Project"
            onClick={() => window.location.href = '/create'}
          />
        ) : (
          <Link
            to="/create"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Project
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectList; 