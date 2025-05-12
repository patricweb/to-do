import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router';
import { WebApp } from '@twa-dev/sdk';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';

function App() {
  React.useEffect(() => {
    if (WebApp) {
      console.log('Telegram Web App initData:', WebApp.initData);
      WebApp.ready();
    } else {
      console.error('Telegram Web App SDK not loaded');
    }
  }, []);

  return (
    <Router>
      <div className="tg-mini-app">
        <div className="container mx-auto px-4">
          <header className="tg-mini-app-header">
            <h1 className="tg-mini-app-title">To-Do List</h1>
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