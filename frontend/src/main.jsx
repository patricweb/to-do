import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

if (window.Telegram && window.Telegram.WebApp) {
  console.log('Telegram Web App SDK loaded:', window.Telegram.WebApp);
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
} else {
  console.error('Telegram Web App SDK not loaded');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);