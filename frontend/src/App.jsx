import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';
import SharedProjectPage from './components/SharedProjectPage';

function App() {
  console.log('App: Rendering...');
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">To-Do List</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id/create-task" element={<CreateTask />} />
              <Route path="/shared/:token" element={<SharedProjectPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;