import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask } from '../api/api';

const CreateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString() : null;
      console.log('CreateTask: Sending task:', { ...formData, dueDate, projectId: id });
      await createTask(id, formData.title, formData.priority, dueDate);
      navigate(`/project/${id}`);
    } catch (err) {
      console.error('CreateTask: Error:', err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Новая задача</h2>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Название задачи
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Приоритет
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field mt-1"
          >
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Срок выполнения
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="input-field mt-1"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/project/${id}`)}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Создать задачу
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;