import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects, getProjectByToken } from '../api/api';
import { showAlert } from '../utils/telegram';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareToken, setShareToken] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        console.log('ProjectList: Loaded projects:', data);
        setProjects(data);
      } catch (error) {
        console.error('ProjectList: Error loading projects:', error);
        showAlert(`Failed to load projects: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleJoinProject = async () => {
    if (!shareToken) {
      showAlert('Please enter a share token');
      return;
    }
    try {
      const project = await getProjectByToken(shareToken);
      console.log('ProjectList: Joined project:', project);
      navigate(`/project/${project._id}`);
    } catch (error) {
      console.error('ProjectList: Error joining project:', error);
      showAlert(`Failed to join project: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading projects...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/create-project" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New Project
        </Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={shareToken}
          onChange={(e) => setShareToken(e.target.value)}
          placeholder="Enter share token"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleJoinProject}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Join Project
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects found. Create one to start!</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(project => (
            <li key={project._id} className="border p-4 rounded">
              <Link to={`/project/${project._id}`} className="text-blue-600 font-semibold">
                {project.title}
              </Link>
              {project.description && (
                <p className="text-gray-600">{project.description}</p>
              )}
              <p className="text-sm text-gray-500">
                Share Token: {project.shareToken}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;