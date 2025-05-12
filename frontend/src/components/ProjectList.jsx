import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { fetchProjects } from '../api/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    setDebugInfo('Initializing...\n');
    if (!window.Telegram || !window.Telegram.WebApp?.initData) {
      setDebugInfo(prev => prev + 'Error: Telegram Web App not initialized\n');
      setError('Please open this app in Telegram');
      setLoading(false);
      return;
    }

    setDebugInfo(prev => prev + `initData: ${window.Telegram.WebApp.initData}\n`);

    const getProjects = async () => {
      try {
        setDebugInfo(prev => prev + 'Fetching projects...\n');
        const data = await fetchProjects();
        setDebugInfo(prev => prev + `Projects fetched: ${JSON.stringify(data)}\n`);
        setProjects(data);
      } catch (err) {
        setDebugInfo(prev => prev + `Error: ${err.message}\n`);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* Отладочная информация */}
      <pre style={{ background: '#f0f0f0', padding: '10px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
        {debugInfo}
      </pre>

      {/* Кнопка "Новый проект" */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Мои проекты</h2>
        <Link
          to="/create-project"
          className="btn-primary flex items-center space-x-2"
          style={{ backgroundColor: '#2481cc', color: 'white', padding: '10px 20px' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Новый проект</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет проектов</h3>
          <p className="mt-1 text-sm text-gray-500">Начните с создания нового проекта.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;