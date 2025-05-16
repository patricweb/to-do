import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTask } from '../api/api';
import { showAlert } from '../utils/telegram';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

const CreateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showAlert('Please enter a task title');
      return;
    }
    setIsSubmitting(true);
    try {
      const task = await createTask(id, title, priority, dueDate || null);
      console.log('CreateTask: Task created:', task);
      showAlert('Task created successfully!');
      navigate(`/project/${id}`);
    } catch (error) {
      console.error('CreateTask: Error creating task:', error);
      showAlert(`Failed to create task: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <BackButton onClick={() => navigate(`/project/${id}`)} />
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Task title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </div>
  );
};

export default CreateTask;