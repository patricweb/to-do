import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WebApp } from '@twa-dev/sdk';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';

function App() {
  React.useEffect(() => {
    // Set the app background color
    document.body.style.backgroundColor = WebApp.backgroundColor;
    document.body.style.color = WebApp.textColor;

    // Expand the app to full height
    WebApp.expand();

    // Enable the main button
    WebApp.MainButton.show();

    // Set the app ready
    WebApp.ready();
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