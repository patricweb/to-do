import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/api';
import { showAlert } from '../utils/telegram';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

const CreateProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showAlert('Please enter a project title');
      return;
    }
    setIsSubmitting(true);
    try {
      const project = await createProject(title, description);
      console.log('CreateProject: Project created:', project);
      showAlert('Project created successfully!');
      navigate(`/project/${project._id}`);
    } catch (error) {
      console.error('CreateProject: Error creating project:', error);
      showAlert(`Failed to create project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <BackButton onClick={() => navigate('/')} />
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Project description"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </div>
  );
};

export default CreateProject;