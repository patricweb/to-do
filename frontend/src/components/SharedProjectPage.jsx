import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjectByToken } from '../api/api';
import { showAlert } from '../utils/telegram';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import TaskManager from './TaskManager';

const SharedProjectPage = () => {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectByToken(token);
        console.log('SharedProjectPage: Loaded project:', response);
        setProject(response);
      } catch (error) {
        console.error('SharedProjectPage: Error accessing shared project:', error);
        showAlert('Error accessing shared project: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [token]);

  if (isLoading) {
    return <div className="text-center">Loading shared project...</div>;
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
        <TaskManager projectId={project._id} />
      </div>
    </div>
  );
};

export default SharedProjectPage;