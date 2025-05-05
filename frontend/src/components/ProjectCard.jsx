import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
          <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            {project.members.length} участников
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Создан: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <Link 
            to={`/project/${project._id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Открыть
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;