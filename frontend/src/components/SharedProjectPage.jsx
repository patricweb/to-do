import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { showAlert } from '../utils/telegram';
import axios from 'axios';
import TaskManager from './TaskManager';

const SharedProjectPage = ({ user }) => {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/shared/${token}`, {
          headers: {
            'x-telegram-init-data': window.Telegram.WebApp.initData
          }
        });
        setProject(response.data);
      } catch (error) {
        showAlert('Error accessing shared project: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [token]);

  if (isLoading) {
    return <div>Loading shared project...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
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