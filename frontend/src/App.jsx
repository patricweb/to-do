import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import ProjectPage from './components/ProjectPage';
import TasksPage from './components/TasksPage';
import SharedProjectPage from './components/SharedProjectPage';
import CreateProject from './components/CreateProject';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user from Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      if (initData && initData.user) {
        setUser(initData.user);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ProjectPage user={user} />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/projects/:projectId/tasks" element={<TasksPage user={user} />} />
          <Route path="/shared/:token" element={<SharedProjectPage user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;