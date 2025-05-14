import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';

function App() {
  console.log('App: Rendering...');
  console.log('App: Current URL:', window.location.href);
  return (
    <Router>
      <div className="tg-mini-app min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="tg-mini-app-header mb-6">
            <h1 className="tg-mini-app-title text-3xl font-bold text-gray-800">To-Do List</h1>
          </header>

          <main className="animate-fade-in">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id/create-task" element={<CreateTask />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;