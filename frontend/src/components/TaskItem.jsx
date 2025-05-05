import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task._id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="mt-2 text-gray-600 text-sm">{task.description}</p>
            )}
            
            <div className="mt-3 flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  До: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem; 