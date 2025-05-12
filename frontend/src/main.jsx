import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Динамическая загрузка Telegram Web App SDK
const loadTelegramSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram Web App SDK already loaded:', window.Telegram.WebApp);
      resolve(window.Telegram.WebApp);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram Web App SDK loaded:', window.Telegram.WebApp);
        resolve(window.Telegram.WebApp);
      } else {
        reject(new Error('Telegram Web App SDK failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Telegram Web App SDK'));
    document.head.appendChild(script);
  });
};

// Инициализация приложения
loadTelegramSDK()
  .then(WebApp => {
    WebApp.ready();
    WebApp.expand();
    console.log('Telegram Web App initialized, initData:', WebApp.initData);

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(err => {
    console.error('Error loading Telegram Web App SDK:', err);
    ReactDOM.createRoot(document.getElementById('root')).render(
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Error: This app must be opened in Telegram. Please use @YourBot.
      </div>
    );
  });