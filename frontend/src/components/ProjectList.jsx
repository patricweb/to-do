import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { fetchProjects } from '../api/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('Initializing...\n');

  useEffect(() => {
    console.log('ProjectList: Initializing...');
    setDebugInfo(prev => prev + 'Checking Telegram Web App...\n');

    const WebApp = window.Telegram?.WebApp;
    const initData = WebApp?.initData || '';
    console.log('ProjectList: initData:', initData);
    setDebugInfo(prev => prev + `initData: ${initData || 'empty'}\n`);
    setDebugInfo(prev => prev + `SDK version: ${WebApp?.version || 'unknown'}\n`);
    setDebugInfo(prev => prev + `URL: ${window.location.href}\n`);
    setDebugInfo(prev => prev + `Platform: ${WebApp?.platform || 'unknown'}\n`);
    setDebugInfo(prev => prev + `User Agent: ${navigator.userAgent}\n`);

    const getProjects = async () => {
      try {
        console.log('ProjectList: Fetching projects...');
        setDebugInfo(prev => prev + 'Fetching projects...\n');
        const data = await fetchProjects();
        console.log('ProjectList: Projects fetched:', data);
        setDebugInfo(prev => prev + `Projects fetched: ${JSON.stringify(data, null, 2)}\n`);
        setProjects(data);
      } catch (err) {
        console.error('ProjectList: Error fetching projects:', err);
        setDebugInfo(prev => prev + `Error: ${err.message || 'Unknown error'}\n`);
        if (err.message.includes('503')) {
          setDebugInfo(prev => prev + 'Backend unavailable (503), showing UI anyway...\n');
        } else if (err.message.includes('401')) {
          setDebugInfo(prev => prev + 'Authentication failed (401), showing UI anyway...\n');
        }
        setError(err.message || 'Failed to load projects');
      } finally {
        console.log('ProjectList: Loading complete');
        setDebugInfo(prev => prev + 'Loading complete\n');
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen" style={{ display: 'block !important' }}>
      <div className="border border-gray-300 p-4 bg-gray-100 text-sm">
        <pre className="debug-pre">{debugInfo}</pre>
      </div>

      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Мои проекты</h2>
        <Link to="/create-project" className="btn-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Новый проект</span>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600">
            Не удалось загрузить проекты: {error}.
            {error.includes('401') && ' Авторизация не удалась. Продолжайте тестировать через создание проектов.'}
            {error.includes('503') && ' Сервер временно недоступен (503). Попробуйте позже.'}
          </p>
          <p className="text-yellow-600 mt-2">Вы всё равно можете создать новый проект.</p>
        </div>
      )}
      {!loading && !error && projects.length === 0 && (
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
      )}
      {!loading && !error && projects.length > 0 && (
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